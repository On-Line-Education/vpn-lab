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
        },
    };
};
