import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import randomString from "../Helpsers/randomString";
import crypto from "crypto";

export default (prisma: PrismaClient) => {
    return {
        Query: {
            async loginViaKey(_: any, { loginKey }: any) {
                console.log({ loginKey });
                await prisma.token.deleteMany({
                    where: {
                        expireOn: {
                            lt: new Date(Date.now()),
                        },
                    },
                });

                let u = await prisma.user.findFirst({
                    where: {
                        loginKey,
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
                return {
                    token: token.token,
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
                        passHash: crypto
                            .createHash("SHA256")
                            .update(password)
                            .digest("hex"),
                    },
                });

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
        },
    };
};
