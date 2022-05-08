import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";

export default (prisma: PrismaClient) => {
    return {
        Query: {
            async getVeyonKeys(_: any, { username }: any, { user, api }) {
                if (!api) {
                    throw new AuthenticationError("Not authorized");
                }
                let u = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });
                return {
                    pubKey: u.veyonKeyPub,
                    privKey: u.veyonKeyPriv,
                };
            },
        },
    };
};
