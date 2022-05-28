import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import { example as defaultACL } from "../SoftEtherApi/SoftEtherData/VpnAccessDataIPv4";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getHub(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.hub.get(hubName);
            },
            async createHub(
                _: any,
                { hubName, hubType, online, maxSession, password, noEnum }: any,
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let createHub = await vpn.hub.create(
                    hubName,
                    hubType,
                    online,
                    maxSession,
                    password,
                    noEnum
                );

                let defaultAcl = defaultACL();

                defaultAcl.DestUsername_str = createHub.HubName_str;
                defaultAcl.SrcUsername_str = createHub.HubName_str;

                await vpn.acl.addAlIpv4(createHub.HubName_str, defaultAcl);

                return createHub;
            },
            async listHubs(_1: any, _2: any, { user, api }) {
                console.log({ user, api });
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
            async updateHub(
                _: any,
                { hubName, hubType, online, maxSession, password, noEnum }: any,
                { user, api }
            ) {
                if (!(api || user)) {
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
            async deleteHub(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return await vpn.hub.delete(hubName);
            },
            async getHubUsers(_: any, { hubName }: any, guard: { user; api }) {
                if (!(guard.api || guard.user)) {
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
                        group: usr.UsersGroup[0]?.groupName ?? "",
                    };
                });

                (await vpn.user.getUsersList(hubName)).UserList.forEach(
                    (user) => {
                        dbUsers.forEach((dbu) => {
                            if (dbu.name === user.Name_str) {
                                users.push({ user, group: dbu.group });
                            }
                        });
                    }
                );

                return users;
            },
        },
        HubType: {
            Standalone: 0,
            FarmStatic: 1,
            FarmDynamic: 2,
        },
    };
};
