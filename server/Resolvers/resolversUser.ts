import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import randomString from "../Helpsers/randomString";
import crypto from "crypto";
import Roles from "../Helpsers/roles";
import VeyonConnector from "../Veyon/veyonConnector";
import { VpnRpcUserAuthType } from "vpnrpc";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            getCurrentUser(_1: any, _2: any, { user, api }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return user;
            },
            async loginViaKey(_: any, { loginKey }: any) {
                await prisma.token.deleteMany({
                    where: {
                        expireOn: {
                            lt: new Date(Date.now()),
                        },
                    },
                });

                if (!loginKey || loginKey.trim() === "") {
                    throw new Error("Kod dostępu nie może być pusty");
                }

                let u = await prisma.user.findFirst({
                    where: {
                        loginKey: crypto
                            .createHash("SHA256")
                            .update(loginKey)
                            .digest("hex"),
                    },
                });

                if (!u) {
                    throw new AuthenticationError("Nieprawidłowy kod dostępu");
                }

                let expire = new Date(Date.now());
                expire.setHours(expire.getHours() + 1);

                let token = await prisma.token.create({
                    data: {
                        token: randomString(16),
                        expireOn: expire,
                        userId: u.id,
                    },
                });

                let userHubs = await prisma.usersInHub.findMany({
                    where: {
                        user: {
                            name: u.name,
                        },
                    },
                    select: {
                        hub: {
                            select: {
                                title: true,
                            },
                        },
                    },
                });

                return {
                    token: token.token,
                    user: {
                        name: u.name,
                        role: u.role,
                        id: u.id,
                        hubs: userHubs.map((m) => {
                            return m.hub.title;
                        }),
                    },
                };
            },
            async loginViaPassword(_: any, { username, password }: any) {
                await prisma.token.deleteMany({
                    where: {
                        expireOn: {
                            lt: new Date(Date.now()),
                        },
                    },
                });

                let u = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });

                if (!u.passHash) {
                    throw new Error("Nieprawidłowa forma logowania");
                }
                if (
                    u.passHash !=
                    crypto.createHash("SHA256").update(password).digest("hex")
                ) {
                    u = null;
                }

                if (!u) {
                    throw new AuthenticationError(
                        "Nieprawidłowa nazwa użytkownika lub hasło"
                    );
                }

                let expire = new Date(Date.now());
                expire.setHours(expire.getHours() + 1);

                let token = await prisma.token.create({
                    data: {
                        token: randomString(16),
                        expireOn: expire,
                        userId: u.id,
                    },
                });
                return {
                    token: token.token,
                };
            },
            async getAllUsersInStudentsGroup(
                _: any,
                { username, group }: any,
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    user &&
                    ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)
                ) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                let usersWithTeacher = [];

                let dbuser = await prisma.usersGroup.findFirst({
                    where: {
                        userHub: {
                            user: {
                                name: username,
                            },
                        },
                    },
                    select: {
                        userHub: {
                            include: {
                                user: true,
                                hub: true,
                            },
                        },
                    },
                });

                let usersHub = await prisma.usersGroup.findMany({
                    where: {
                        userHub: {
                            user: {
                                hubs: {
                                    some: {
                                        hubId: dbuser.userHub.user.id,
                                    },
                                },
                            },
                        },
                        groupName: group,
                    },
                    select: {
                        userHub: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });

                usersHub.map((r) => {
                    usersWithTeacher.push({
                        id: r.userHub.user.id,
                        name: r.userHub.user.name,
                        role: r.userHub.user.role,
                        veyonKeyPriv: r.userHub.user.veyonKeyPriv,
                        veyonKeyPub: r.userHub.user.veyonKeyPub,
                        groupName: group,
                    });
                });
                return usersWithTeacher;
            },
            async getTeachersInUserGroups(
                _: any,
                { username }: any,
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    user &&
                    ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)
                ) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                let teachersInGroups = [];

                let userdb = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });

                let userWithGroups = await prisma.usersGroup.findFirst({
                    where: {
                        userHub: {
                            user: {
                                name: username,
                            },
                        },
                    },
                    select: {
                        userHub: {
                            include: {
                                user: true,
                                hub: true,
                            },
                        },
                        groupName: true,
                    },
                });

                if (!userWithGroups)
                    throw new Error("Użytkownik nie należy do żadnej grupy");

                let usersHub = await prisma.usersGroup.findMany({
                    where: {
                        userHub: {
                            user: {
                                role: Roles.INSTRUCTOR,
                            },
                        },
                        groupName: userWithGroups.groupName,
                    },
                    select: {
                        userHub: {
                            include: {
                                user: true,
                            },
                        },
                        groupName: true,
                    },
                });

                usersHub.map((r) => {
                    teachersInGroups.push({
                        id: r.userHub.user.id,
                        name: r.userHub.user.name,
                        role: r.userHub.user.role,
                        veyonKeyPriv: r.userHub.user.veyonKeyPriv,
                        veyonKeyPub: r.userHub.user.veyonKeyPub,
                        groupName: r.groupName,
                    });
                });
                return {
                    teachers: teachersInGroups,
                    user: { vpnLogin: userdb.name, vpnPass: userdb.vpnPass },
                };
            },
        },
        Mutation: {
            async changeUserSettings(
                _: any,
                { settings }: { settings: { newPassword; oldPassword } },
                { user, api }
            ) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                let oldPass = crypto
                    .createHash("SHA256")
                    .update(settings.oldPassword)
                    .digest("hex");

                if (user.passHash !== oldPass) {
                    throw new Error("Podane hasło jest nieprawidłowe");
                }
                if (
                    !/(?=.*[0-9])(?=.*[A-Z])(.*[a-zA-Z0-9.*]){8,}$/g.test(
                        settings.newPassword
                    )
                ) {
                    throw new Error(
                        "Hasło musi składać się z minimum 8 znaków, posiadać minimum jedną dużą literę oraz cyfrę"
                    );
                }
                let newPass = crypto
                    .createHash("SHA256")
                    .update(settings.newPassword)
                    .digest("hex");

                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        passHash: newPass,
                    },
                });

                return true;
            },
            async createUser(
                _: any,
                { hubname, username, password, passcode, role },
                { user, api }
            ) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    user &&
                    ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)
                ) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                if (
                    (await prisma.user.findFirst({
                        where: {
                            name: username,
                            OR: {
                                loginKey: passcode,
                            },
                        },
                    })) != null
                ) {
                    throw new Error(
                        "Istnieje już użytkownik z taką nazwą lub kodem dostępu"
                    );
                }

                let hub = await prisma.hub.findFirst({
                    where: { title: hubname },
                });

                if (hub == null) {
                    throw new Error("Hub nie istnieje");
                }

                let hubId = hub.id;
                let veyonConnector = new VeyonConnector();
                let pubKey = null,
                    privKey = null;
                if (role === Roles.INSTRUCTOR) {
                    let { pub, priv } = await veyonConnector.getKeyPair();
                    pubKey = pub;
                    privKey = priv;
                }

                let dbuser = await prisma.user.create({
                    data: {
                        name: username,
                        role: role,
                        passHash: crypto
                            .createHash("SHA256")
                            .update(password)
                            .digest("hex"),
                        veyonKeyPriv: privKey,
                        veyonKeyPub: pubKey,
                        loginKey: crypto
                            .createHash("SHA256")
                            .update(passcode)
                            .digest("hex"),
                        vpnPass: randomString(16),
                        hubs: {
                            create: {
                                hubId,
                            },
                        },
                    },
                });

                await vpn.user.createUser(
                    hubname,
                    username,
                    username,
                    VpnRpcUserAuthType.Password,
                    dbuser.vpnPass,
                    role == Roles.INSTRUCTOR
                        ? username + "_" + Date.now() + "_vpn_group"
                        : null
                );

                return true;
            },
            async deleteUser(_: any, { hubname, username }, { user, api }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (
                    user &&
                    ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)
                ) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                let dbuser = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });

                let uih = await prisma.usersInHub.findFirst({
                    where: {
                        userId: dbuser.id,
                    },
                });

                let uig = await prisma.usersGroup.findMany({
                    where: {
                        userHub: {
                            userId: dbuser.id,
                        },
                    },
                });

                for (let entry in uig) {
                    await prisma.usersGroup.delete({
                        where: {
                            id: uig[entry].id,
                        },
                    });
                }

                await prisma.usersInHub.delete({
                    where: {
                        id: uih.id,
                    },
                });

                await prisma.user.delete({
                    where: {
                        id: dbuser.id,
                    },
                });

                await vpn.user.deleteUser(hubname, username);
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
