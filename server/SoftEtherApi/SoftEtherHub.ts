import {
    VpnServerRpc,
    VpnRpcCreateHub,
    VpnRpcHubType,
    VpnRpcHubStatus,
    VpnRpcEnumHub,
    VpnRpcDeleteHub,
    VpnRpcSetHubOnline,
} from "vpnrpc";

export default class SoftEtherHub {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async create(
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

    public async get(hubName: string): Promise<VpnRpcCreateHub> {
        let data: VpnRpcCreateHub = new VpnRpcCreateHub({
            HubName_str: hubName,
        });
        return await this.api.GetHub(data);
    }

    public async getStatus(hubName: string): Promise<VpnRpcHubStatus> {
        let data: VpnRpcHubStatus = new VpnRpcHubStatus({
            HubName_str: hubName,
        });
        return await this.api.GetHubStatus(data);
    }

    public async update(
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

    public async list(): Promise<VpnRpcEnumHub> {
        return await this.api.EnumHub();
    }

    public async delete(hubName: string): Promise<VpnRpcDeleteHub> {
        let data = new VpnRpcDeleteHub({
            HubName_str: hubName,
        });
        return await this.api.DeleteHub(data);
    }

    public async changeOnline(
        hubName: string,
        online: boolean
    ): Promise<VpnRpcSetHubOnline> {
        let data = new VpnRpcSetHubOnline({
            HubName_str: hubName,
            Online_bool: online,
        });
        return await this.api.SetHubOnline(data);
    }
}
