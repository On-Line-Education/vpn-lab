import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import Roles from "../Helpsers/roles";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async listGroups(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.group.list(hubName);
            },
            async listSystemGroups(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let l = await prisma.usersGroup.findMany({
                    where: {
                        userHub: {
                            hub: {
                                title: hubName,
                            },
                        },
                    },
                    select: {
                        groupName: true,
                    },
                });
                return l
                    .map((el) => {
                        return el.groupName;
                    })
                    .filter((el, pos, arr) => {
                        return arr.indexOf(el) == pos;
                    });
            },
            async removeFromSystemGroup(
                _: any,
                { hubName, username, group }: any,
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if(user && ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)){
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                await prisma.usersGroup.deleteMany({
                    where: {
                        userHub: {
                            hub: {
                                title: hubName,
                            },
                            user: {
                                name: username,
                            },
                        },
                        groupName: group,
                    },
                });

                return true;
            },
            async createGroup(_: any, { group }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if(user && ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)){
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.group.create(group);
            },
            async addUserToGroup(
                _: any,
                { userName, group, hubName },
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if(user && ![Roles.ADMIN, Roles.INSTRUCTOR].includes(user.role)){
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let userhub = await prisma.usersInHub.findFirst({
                    where: {
                        user: {
                            name: userName,
                        },
                        hub: {
                            title: hubName,
                        },
                    },
                });

                let ug = await prisma.usersGroup.findFirst({
                    where: {
                        userHubId: userhub.id,
                        groupName: group,
                    },
                });

                if (ug) {
                    return false;
                }

                let gr = await prisma.usersGroup.create({
                    data: {
                        groupName: group,
                        userHubId: userhub.id,
                    },
                });

                console.log({ gr, userName, group, hubName });

                return true;
            },
            async getGroupsInHub(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await prisma.usersGroup.findMany({
                    where: {
                        userHub: {
                            hub: {
                                title: hubName,
                            },
                        },
                    },
                    select: {
                        groupName: true,
                    },
                    distinct: ["groupName"],
                });
            },
        },
    };
};
