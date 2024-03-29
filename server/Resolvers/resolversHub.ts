import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { example as defaultACL } from "../SoftEtherApi/SoftEtherData/VpnAccessDataIPv4";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";
import Roles from "../Helpsers/roles";
import crypto from "crypto";
import VeyonConnector from "../Veyon/veyonConnector";
import { VpnRpcHubType, VpnRpcUserAuthType, VpnAccess, VpnIpProtocolNumber } from "vpnrpc";
import randomString from "../Helpsers/randomString";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getHub(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.hub.get(hubName);
            },
            async listHubs(_1: any, _2: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let vpnHubs = await vpn.hub.list(),
                    v = { HubList: [], NumHub_u32: vpnHubs.NumHub_u32 },
                    systemHubs = (
                        await prisma.hub.findMany({
                            select: {
                                title: true,
                            },
                        })
                    ).map((e) => {
                        return e.title;
                    });

                vpnHubs.HubList.forEach((hub) => {
                    if (systemHubs.includes(hub.HubName_str)) {
                        v.HubList.push(hub);
                    }
                });
                for (let i in v.HubList) {
                    v.HubList[i]["Recv_BroadcastBytes_u64"] =
                        v.HubList[i]["Ex.Recv.BroadcastBytes_u64"];
                    v.HubList[i]["Recv_BroadcastCount_u64"] =
                        v.HubList[i]["Ex.Recv.BroadcastCount_u64"];
                    v.HubList[i]["Recv_UnicastBytes_u64"] =
                        v.HubList[i]["Ex.Recv.UnicastBytes_u64"];
                    v.HubList[i]["Recv_UnicastCount_u64"] =
                        v.HubList[i]["Ex.Recv.UnicastCount_u64"];
                    v.HubList[i]["Send_BroadcastBytes_u64"] =
                        v.HubList[i]["Ex.Send.BroadcastBytes_u64"];
                    v.HubList[i]["Send_BroadcastCount_u64"] =
                        v.HubList[i]["Ex.Send.BroadcastCount_u64"];
                    v.HubList[i]["Send_UnicastBytes_u64"] =
                        v.HubList[i]["Ex.Recv.UnicastBytes_u64"];
                    v.HubList[i]["Send_UnicastCount_u64"] =
                        v.HubList[i]["Ex.Recv.UnicastCount_u64"];
                }

                return v;
            },
            async listUserHubs(_1: any, { username }: any, { user, api }) {
                let v = await this.listHubs(null, null, { user, api });

                if (!username) {
                    username = user.name;
                }

                let userHubs = (
                    await prisma.usersInHub.findMany({
                        where: {
                            user: {
                                name: username,
                            },
                        },
                        select: {
                            hub: true,
                        },
                    })
                ).map((h) => {
                    return h.hub.title;
                });

                v.HubList = v.HubList.filter((hub: { HubName_str: string }) => {
                    return userHubs.includes(hub.HubName_str);
                });

                return v;
            },
            async getHubStatus(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let v = await vpn.hub.getStatus(hubName);
                v["Recv_BroadcastBytes_u64"] = v["Ex.Recv.BroadcastBytes_u64"];
                v["Recv_BroadcastCount_u64"] = v["Ex.Recv.BroadcastCount_u64"];
                v["Recv_UnicastBytes_u64"] = v["Ex.Recv.UnicastBytes_u64"];
                v["Recv_UnicastCount_u64"] = v["Ex.Recv.UnicastCount_u64"];
                v["Send_BroadcastBytes_u64"] = v["Ex.Send.BroadcastBytes_u64"];
                v["Send_BroadcastCount_u64"] = v["Ex.Send.BroadcastCount_u64"];
                v["Send_UnicastBytes_u64"] = v["Ex.Recv.UnicastBytes_u64"];
                v["Send_UnicastCount_u64"] = v["Ex.Recv.UnicastCount_u64"];
                return v;
            },
            async getHubUsers(_: any, { hubName }: any, guard: { user; api }) {
                if (!(guard.api || guard.user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    guard.user &&
                    ![Roles.ADMIN, Roles.INSTRUCTOR].includes(guard.user.role)
                ) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let users = [];
                let dbUsers = (
                    await prisma.usersInHub.findMany({
                        where: {
                            hub: {
                                title: hubName,
                            },
                        },
                        select: {
                            user: true,
                            UsersGroup: true,
                        },
                    })
                ).map((usr) => {
                    return {
                        name: usr.user.name,
                        groups: usr.UsersGroup,
                        role: usr.user.role,
                        username: usr.user.username,
                    };
                });

                (await vpn.user.getUsersList(hubName)).UserList.forEach(
                    (user) => {
                        dbUsers.forEach((dbu) => {
                            if (dbu.name === user.Name_str) {
                                users.push({
                                    user,
                                    groups: dbu.groups.map((e) => {
                                        return e.groupName;
                                    }),
                                    role: dbu.role,
                                    username: dbu.username,
                                });
                            }
                        });
                    }
                );

                return users;
            },
        },
        Mutation: {
            async createNewHub(
                _: any,
                { hubName, instructorUsername, instructorPassword }: any,
                { user, api }
            ) {
                let hinstructorName = hubName + "_" + instructorUsername;
                let hinstructorUsername = instructorUsername + "@" + hubName;
                if (
                    (await prisma.hub.findFirst({
                        where: {
                            title: hubName,
                        },
                    })) != null
                ) {
                    throw new Error("Taki hub już istnieje");
                }

                if (
                    (await prisma.user.findFirst({
                        where: {
                            name: hinstructorName,
                        },
                    })) != null
                ) {
                    throw new Error("Taki użytkownik już istnieje");
                }

                let hubId = (
                    await prisma.hub.create({
                        data: {
                            title: hubName,
                        },
                    })
                    ).id;

                await vpn.hub.create(
                    hubName,
                    VpnRpcHubType.Standalone,
                    true,
                    256,
                    randomString(16)
                    );

                await vpn.acl.addAlIpv4Custom(hubName, new VpnAccess({
                    Active_bool: true,
                    Priority_u32: 110,
                    Discard_bool: false,
                    IsIPv6_bool: false,
                    Protocol_u32: VpnIpProtocolNumber.UDP,
                    DestPortStart_u32: 67,
                    DestPortEnd_u32: 68
                }));

                await vpn.acl.addAlIpv4Custom(hubName, new VpnAccess({
                    Active_bool: true,
                    Priority_u32: 1000,
                    Discard_bool: true,
                    IsIPv6_bool: false
                }));

//                 let defaultAcl = defaultACL();
//
//                 defaultAcl.DestUsername_str = createHub.HubName_str;
//                 defaultAcl.SrcUsername_str = createHub.HubName_str;
//
//                 await vpn.acl.addAlIpv4(createHub.HubName_str, defaultAcl);

                let veyonConnector = new VeyonConnector();
                let { pub, priv } = await veyonConnector.getKeyPair();

                let dbuser = await prisma.user.create({
                    data: {
                        name: hinstructorName,
                        role: Roles.INSTRUCTOR,
                        username: hinstructorUsername,
                        passHash: crypto
                            .createHash("SHA256")
                            .update(instructorPassword)
                            .digest("hex"),
                        veyonKeyPriv: priv,
                        veyonKeyPub: pub,
                        vpnPass: randomString(8),
                        hubs: {
                            create: {
                                hubId,
                            },
                        },
                    },
                });
                const group = user.name + "_" + Date.now() + "_vpn_group";
                await vpn.user.createUser(
                    hubName,
                    dbuser.name,
                    dbuser.name,
                    VpnRpcUserAuthType.Password,
                    dbuser.vpnPass,
                    group
                );

                await vpn.acl.addAlIpv4Custom(hubName, new VpnAccess({
                    Active_bool: true,
                    Priority_u32: 100,
                    Discard_bool: false,
                    IsIPv6_bool: false,
                    SrcUsername_str: group,
                    DestUsername_str: group
                }));

                return true;
            },
            // async createHub(
            //     _: any,
            //     { hubName, hubType, online, maxSession, password, noEnum }: any,
            //     { user, api }
            // ) {
            //     if (!(api || user)) {
            //         throw new AuthenticationError("Nie masz uprawnień");
            //     }
            //     if(user && ![Roles.ADMIN].includes(user.role)){
            //         throw new AuthenticationError("Nie masz uprawnień");
            //     }
            //     let createHub = await vpn.hub.create(
            //         hubName,
            //         hubType,
            //         online,
            //         maxSession,
            //         password,
            //         noEnum
            //     );

            //     let defaultAcl = defaultACL();

            //     defaultAcl.DestUsername_str = createHub.HubName_str;
            //     defaultAcl.SrcUsername_str = createHub.HubName_str;

            //     await vpn.acl.addAlIpv4(createHub.HubName_str, defaultAcl);

            //     return createHub;
            // },
            async updateHub(
                _: any,
                { hubName, hubType, online, maxSession, password, noEnum }: any,
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && ![Roles.ADMIN].includes(user.role)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.hub.update(
                    hubName,
                    hubType,
                    online,
                    maxSession,
                    password,
                    noEnum
                );
            },
            async deleteHub(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (user && ![Roles.ADMIN].includes(user.role)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                await prisma.hub.delete({
                    where: {
                        title: hubName,
                    },
                });

                await vpn.hub.delete(hubName);
                return true;
            },
        },
        HubType: {
            Standalone: 0,
            FarmStatic: 1,
            FarmDynamic: 2,
        },
    };
};
