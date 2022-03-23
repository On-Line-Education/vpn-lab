import {
    VpnServerRpc,
    VpnRpcCreateHub,
    VpnRpcHubType,
    VpnRpcHubStatus,
    VpnRpcEnumHub,
    VpnRpcDeleteHub,
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

    public async getHubStatus(hubName: string): Promise<VpnRpcHubStatus> {
        let data: VpnRpcHubStatus = new VpnRpcHubStatus({
            HubName_str: hubName,
        });
        return await this.api.GetHubStatus(data);
    }

    public async updateHub(
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

        return await this.api.SetHub(data);
    }

    public async listHubs(): Promise<VpnRpcEnumHub> {
        return await this.api.EnumHub();
    }

    public async deleteHub(hubName: string) {
        let data = new VpnRpcDeleteHub({
            HubName_str: hubName,
        });
        return await this.api.DeleteHub(data);
    }
}
