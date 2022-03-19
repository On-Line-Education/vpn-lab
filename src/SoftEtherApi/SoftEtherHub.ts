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
        hub_name: string,
        hub_type: VpnRpcHubType,
        online: boolean,
        max_session: number,
        password: string,
        no_enum: boolean = false
    ): Promise<VpnRpcCreateHub> {
        let in_rpc_create_hub: VpnRpcCreateHub = new VpnRpcCreateHub({
            HubName_str: hub_name,
            HubType_u32: hub_type,
            Online_bool: online,
            AdminPasswordPlainText_str: password,
            MaxSession_u32: max_session,
            NoEnum_bool: no_enum,
        });
        return await this.api.CreateHub(in_rpc_create_hub);
    }

    public async getHub(hub_name: string): Promise<VpnRpcCreateHub> {
        let in_rpc_create_hub: VpnRpcCreateHub = new VpnRpcCreateHub({
            HubName_str: hub_name,
        });
        return await this.api.GetHub(in_rpc_create_hub);
    }

    async getHubStatus(hub_name: string): Promise<VpnRpcHubStatus> {
        let in_rpc_hub_status: VpnRpcHubStatus = new VpnRpcHubStatus({
            HubName_str: hub_name,
        });
        return await this.api.GetHubStatus(in_rpc_hub_status);
    }
}
