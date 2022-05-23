import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import randomString from "../Helpsers/randomString";
import crypto from "crypto";

export default (prisma: PrismaClient) => {
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
        },
    };
};