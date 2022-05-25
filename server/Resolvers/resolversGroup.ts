import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
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
            async createGroup(_: any, { group }: any, { user, api }) {
                if (!(api || user)) {
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
                        userGroupId: userhub.id,
                        groupName: group,
                    },
                });

                if (ug) {
                    return false;
                }

                await prisma.usersGroup.create({
                    data: {
                        groupName: group,
                        userGroupId: userhub.id,
                    },
                });

                return true;
            },
            async getGroupsInHub(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await prisma.usersGroup.findMany({
                    where: {
                        userGroup: {
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
