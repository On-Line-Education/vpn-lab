import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import crypto from "crypto";
import { VpnRpcHubType, VpnRpcUserAuthType, VpnAccess, VpnIpProtocolNumber } from "vpnrpc";
import randomString from "../Helpsers/randomString";
import Roles from "../Helpsers/roles";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";
import VeyonConnector from "../Veyon/veyonConnector";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getIpSec(_1: any, _2: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && user.role !== Roles.ADMIN) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.ipsec.get();
            },
            async getFilesList(_1: any, _2: any, { user }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                let filesList = [];
                if (user.role === Roles.INSTRUCTOR) {
                    filesList = await prisma.files.findMany({
                        where: {
                            OR: [
                                {
                                    permission: Roles.USER,
                                },
                                {
                                    permission: Roles.INSTRUCTOR,
                                },
                            ],
                        },
                    });
                } else if (user.role === Roles.ADMIN) {
                    filesList = await prisma.files.findMany();
                } else {
                    filesList = await prisma.files.findMany({
                        where: {
                            permission: user.role,
                        },
                    });
                }

                return filesList;
            },
            async getRoles(_: any, { id }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return [Roles.ADMIN, Roles.INSTRUCTOR, Roles.USER];
            },
        },
        Mutation: {
            async import(_1: any, { data }: any, { user, api }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    user &&
                    ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)
                ) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let hubId = 0;

                if (
                    (data.newHub && user.role === Roles.INSTRUCTOR) ||
                    (data.newHub &&
                        (await prisma.hub.findFirst({
                            where: { title: data.hubName },
                        })))
                ) {
                    if (user.role === Roles.INSTRUCTOR) {
                        throw new Error(
                            "Tylko Administrator może stworzyć nowy hub."
                        );
                    } else {
                        throw new Error("Hub z taką nazwą już istnieje.");
                    }
                }

                if (user.role === Roles.INSTRUCTOR) {
                    if (
                        !(
                            await prisma.usersInHub.findMany({
                                where: {
                                    user: {
                                        name: user.name,
                                    },
                                },
                                select: {
                                    hub: {
                                        select: {
                                            title: true,
                                        },
                                    },
                                },
                            })
                        )
                            .map((el) => el.hub.title)
                            .includes(data.hubName)
                    ) {
                        throw new Error(
                            "Nie masz uprawnień do importowania do tego huba."
                        );
                    }
                }

                let vpnNamesToCheck = [];
                let namesToCheck = [];

                data.csv.forEach((row: { username: string; role: string }) => {
                    if (row.role === Roles.ADMIN && user.role !== Roles.ADMIN) {
                        throw new Error(
                            "Tylko Administrator może stworzyć użytkownika z uprawnieniami Administratora"
                        );
                    }
                    vpnNamesToCheck.push({
                        name: data.hubName + "_" + row.username,
                    });
                    namesToCheck.push({
                        username: row.username + "@" + data.hubName,
                    });
                });

                let vpnUsers = await prisma.user.findMany({
                    where: { OR: vpnNamesToCheck },
                    select: {
                        name: true
                    }
                });

                if (
                    vpnUsers.length > 0
                ) {
                    return {
                        successful: false,
                        message: "Istnieje już co najmniej jeden użytkownik z podaną nazwą.",
                        names: vpnUsers.map(value=>{

                            return value.name.replace(
                                    value.name.split("_").shift() + "_",
                                    ""
                                    );
                        })
                    };
                    // throw new Error(
                    //     "Istnieje już co najmniej jeden użytkownik z podaną nazwą vpn."
                    // );
                }

                let vpnNames = await prisma.user.findMany({
                    where: { OR: namesToCheck },
                    select: {
                        name: true
                    }
                });

                if (
                    vpnNames.length > 0
                ) {
                    return {
                        successful: false,
                        message: "Istnieje już co najmniej jeden użytkownik z podaną nazwą.",
                        names: vpnNames.map(value=>{
                            return value.name.replace(
                                    "@" + value.name.split("@").pop(),
                                    ""
                                    );
                        })
                    };
                    // throw new Error(
                    //    "Istnieje już co najmniej jeden użytkownik z podaną nazwą."
                    // );
                }

                if (data.newHub) {
                    hubId = (
                        await prisma.hub.create({
                            data: {
                                title: data.hubName,
                            },
                        })
                    ).id;
                    await vpn.hub.create(
                        data.hubName,
                        VpnRpcHubType.Standalone,
                        true,
                        256,
                        randomString(16)
                        );

                    await vpn.acl.addAlIpv4Custom(data.hubName, new VpnAccess({
                        Active_bool: true,
                        Priority_u32: 110,
                        Discard_bool: false,
                        IsIPv6_bool: false,
                        Protocol_u32: VpnIpProtocolNumber.UDP,
                        DestPortStart_u32: 67,
                        DestPortEnd_u32: 68
                    }));
                    
                    await vpn.acl.addAlIpv4Custom(data.hubName, new VpnAccess({
                        Active_bool: true,
                        Priority_u32: 1000,
                        Discard_bool: true,
                        IsIPv6_bool: false
                    }));
                } else {
                    hubId = (
                        await prisma.hub.findUnique({
                            where: { title: data.hubName },
                        })
                    ).id;
                }

                let veyonConnector = new VeyonConnector();
                for (const csvUser of data.csv) {
                    let pubKey = null,
                        privKey = null;
                    if (csvUser.role === Roles.INSTRUCTOR) {
                        // get keypair
                        let { pub, priv } =
                            await veyonConnector.getKeyPair();
                        pubKey = pub;
                        privKey = priv;
                    }
                    let dbuser = await prisma.user.create({
                        data: {
                            name: data.hubName + "_" + csvUser.username,
                            username: csvUser.username + "@" + data.hubName,
                            role: csvUser.role,
                            passHash: csvUser.password
                                ? crypto
                                      .createHash("SHA256")
                                      .update(csvUser.password)
                                      .digest("hex")
                                : "",
                            veyonKeyPriv: privKey,
                            veyonKeyPub: pubKey,
                            vpnPass: randomString(8),
                            hubs: {
                                create: {
                                    hubId,
                                },
                            },
                        },
                    });
                    const group = csvUser.role == Roles.INSTRUCTOR
                    ? csvUser.username +
                    "_" +
                    Date.now() +
                    "_vpn_group"
                    : null;
                    await vpn.user.createUser(
                        data.hubName,
                        data.hubName + "_" + csvUser.username,
                        data.hubName + "_" + csvUser.username,
                        VpnRpcUserAuthType.Password,
                        dbuser.vpnPass,
                        group
                    );

                    if(csvUser.role === Roles.INSTRUCTOR) {
                        await vpn.acl.addAlIpv4Custom(data.hubName, new VpnAccess({
                            Active_bool: true,
                            Priority_u32: 100,
                            Discard_bool: false,
                            IsIPv6_bool: false,
                            SrcUsername_str: group,
                            DestUsername_str: group
                        }));
                    }

                }
                return {
                        successful: true,
                        message: "",
                        names: []
                };
            },
            async setIpSec(_: any, { ipsec }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && user.role !== Roles.ADMIN) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                let curentConfig = await vpn.ipsec.get();

                return await vpn.ipsec.set(
                    ipsec.L2TP_Raw_bool,
                    ipsec.L2TP_IPsec_bool,
                    ipsec.EtherIP_IPsec_bool,
                    ipsec.IPsec_Secret_str
                        ? ipsec.IPsec_Secret_str
                        : curentConfig.IPsec_Secret_str,
                    ipsec.L2TP_DefaultHub_str
                );
            },
            async addFileEntry(
                _: any,
                { name, permission, url }: any,
                { user }
            ) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && ![Roles.ADMIN].includes(user.role)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    ![Roles.ADMIN, Roles.INSTRUCTOR, Roles.USER].includes(
                        permission
                    )
                ) {
                    throw new AuthenticationError("Nieprawidłowa rola");
                }

                await prisma.files.create({
                    data: {
                        name,
                        permission: permission.toLowerCase(),
                        url,
                    },
                });
                return true;
            },
            async deleteFileEntry(_: any, { id }: any, { user }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && ![Roles.ADMIN].includes(user.role)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                await prisma.files.delete({
                    where: {
                        id: id,
                    },
                });
                return true;
            },
            async editFileEntry(_: any, { data }: any, { user }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && ![Roles.ADMIN].includes(user.role)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                await prisma.files.update({
                    where: {
                        id: data.id,
                    },
                    data: {
                        name: data.name,
                        url: data.url,
                        permission: data.permission.toLowerCase(),
                    },
                });
                return true;
            },
        },
        Permission: {
            ADMIN: Roles.ADMIN,
            INSTRUCTOR: Roles.INSTRUCTOR,
            USER: Roles.USER,
        },
    };
};
