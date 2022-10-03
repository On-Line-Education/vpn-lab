import {
    VpnServerRpc,
    VpnRpcCreateHub,
    VpnRpcHubType,
    VpnRpcHubStatus,
    VpnRpcEnumHub,
    VpnRpcDeleteHub,
    VpnRpcSetHubOnline,
    VpnVhOption,
    VpnRpcHub,
} from "vpnrpc";
import SoftEtherAPI from "./SoftEtherAPI";

export default class SoftEtherHub {
    protected api: VpnServerRpc;
    protected parent: SoftEtherAPI;
    constructor(parent: SoftEtherAPI) {
        this.api = parent.getApi();
        this.parent = parent;
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
        let ch = await this.api.CreateHub(data);
        let hub: VpnRpcHub = new VpnRpcHub({
            HubName_str: hubName,
        });
        await this.api.EnableSecureNAT(hub);
        return ch;
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

    public async getSecureNATOption(hubName: string): Promise<VpnVhOption> {
        let in_vh_option: VpnVhOption = new VpnVhOption({
            RpcHubName_str: hubName,
        });
        return await this.api.GetSecureNATOption(in_vh_option);
    }

    public async update(
        hubName: string,
        hubType: VpnRpcHubType = null,
        online: boolean = null,
        maxSession: number = null,
        password: string = null,
        noEnum: boolean = null
    ): Promise<VpnRpcCreateHub> {
        let hub = await this.get(hubName);
        if (hubType) {
            hub.HubType_u32 = hubType;
        }
        if (online) {
            hub.Online_bool = online;
        }
        if (maxSession) {
            hub.MaxSession_u32 = maxSession;
        }
        if (password) {
            hub.AdminPasswordPlainText_str = password;
        }
        if (noEnum) {
            hub.NoEnum_bool = noEnum;
        }

        let data: VpnRpcCreateHub = new VpnRpcCreateHub({
            HubName_str: hubName,
            HubType_u32: hub.HubType_u32,
            Online_bool: hub.Online_bool,
            AdminPasswordPlainText_str: hub.AdminPasswordPlainText_str,
            MaxSession_u32: hub.MaxSession_u32,
            NoEnum_bool: hub.NoEnum_bool,
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
