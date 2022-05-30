import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import crypto from "crypto";
import { VpnRpcHubType, VpnRpcUserAuthType } from "vpnrpc";
import { routerViewLocationKey } from "vue-router";
import randomString from "../Helpsers/randomString";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async import(_1: any, { data }: any, { user, api }) {
                if (!user) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let hubId = 0;

                if (
                    data.newHub &&
                    (await prisma.hub.findFirst({
                        where: { title: data.hubName },
                    }))
                ) {
                    throw new Error("Hub z taką nazwą już istnieje.");
                }

                let namesToCheck = [];
                data.csv.forEach((row: { name: string }) => {
                    namesToCheck.push({ name: row.name });
                });

                if (
                    await prisma.user.findFirst({ where: { OR: namesToCheck } })
                ) {
                    throw new Error(
                        "Istnieje już co najmniej jeden użytkownik z podaną nazwą."
                    );
                }
                console.log(data);

                if (data.newHub) {
                    let server = await prisma.server.findFirst();

                    if (server === null) {
                        throw new Error(
                            "Brak danych na temat serwera, skontaktuj się z administratorem systemu."
                        );
                    }

                    let serverId = server.id;
                    hubId = (
                        await prisma.hub.create({
                            data: {
                                title: data.hubName,
                                serverId,
                            },
                        })
                    ).id;
                    await vpn.hub.create(
                        data.hubName,
                        VpnRpcHubType.Standalone,
                        true,
                        64,
                        randomString(16),
                        true
                    );
                } else {
                    hubId = (
                        await prisma.hub.findUnique({
                            where: { title: data.hubName },
                        })
                    ).id;
                }

                data.csv.forEach(
                    async (user: {
                        name: string;
                        role: string;
                        password: string;
                        passcode: string;
                    }) => {
                        let dbuser = await prisma.user.create({
                            data: {
                                name: user.name,
                                role: user.role,
                                passHash: user.password
                                    ? crypto
                                          .createHash("SHA256")
                                          .update(user.password)
                                          .digest("hex")
                                    : "",
                                veyonKeyPriv: null,
                                veyonKeyPub: null,
                                loginKey: user.passcode
                                    ? crypto
                                          .createHash("SHA256")
                                          .update(user.passcode)
                                          .digest("hex")
                                    : null,
                                hubs: {
                                    create: {
                                        hubId,
                                    },
                                },
                            },
                        });
                        await vpn.user.createUser(
                            data.hubName,
                            user.name,
                            user.name,
                            VpnRpcUserAuthType.Password,
                            dbuser.passHash ? dbuser.passHash : dbuser.loginKey
                        );
                    }
                );
                return true;
            },
        },
    };
};
