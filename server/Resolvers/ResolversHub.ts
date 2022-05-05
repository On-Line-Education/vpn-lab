import { AuthenticationError } from "apollo-server-express";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getHub(_: any, { hubName }: any) {
                return await vpn.hub.get(hubName);
            },
            async createHub(
                _: any,
                { hubName, hubType, online, maxSession, password, noEnum }: any,
                context: { user: any }
            ) {
                if (!context.user)
                    throw new AuthenticationError("you must be logged in");
                return await vpn.hub.create(
                    hubName,
                    hubType,
                    online,
                    maxSession,
                    password,
                    noEnum
                );
            },
            async listHubs() {
                let v = await vpn.hub.list();

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
                { hubName, hubType, online, maxSession, password, noEnum }: any
            ) {
                return await vpn.hub.update(
                    hubName,
                    hubType,
                    online,
                    maxSession,
                    password,
                    noEnum
                );
            },
            async getHubStatus(_: any, { hubName }: any) {
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
            async deleteHub(_: any, { hubName }: any) {
                return await vpn.hub.delete(hubName);
            },
        },
        HubType: {
            Standalone: 0,
            FarmStatic: 1,
            FarmDynamic: 2,
        },
    };
};
