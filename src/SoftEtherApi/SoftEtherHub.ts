import {
    VpnServerRpc,
    VpnRpcCreateHub,
    VpnRpcHubType,
    VpnRpcHubStatus,
} from "vpnrpc";

export default class SoftEtherHub {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async createHub(
        hubName: string,
        hubType: VpnRpcHubType,
        online: boolean,
        maxSession: number,
        password: string,
        noEnum: boolean = false
    ): Promise<VpnRpcCreateHub> {
        let data: VpnRpcCreateHub = new VpnRpcCreateHub({
            HubName_str: hubName,
            HubType_u32: hubType,
            Online_bool: online,
            AdminPasswordPlainText_str: password,
            MaxSession_u32: maxSession,
            NoEnum_bool: noEnum,
        });
        return await this.api.CreateHub(data);
    }

    public async getHub(hubName: string): Promise<VpnRpcCreateHub> {
        let data: VpnRpcCreateHub = new VpnRpcCreateHub({
            HubName_str: hubName,
        });
        return await this.api.GetHub(data);
    }

    async getHubStatus(hubName: string): Promise<VpnRpcHubStatus> {
        let data: VpnRpcHubStatus = new VpnRpcHubStatus({
            HubName_str: hubName,
        });
        return await this.api.GetHubStatus(data);
    }
}
