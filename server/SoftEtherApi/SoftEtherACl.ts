import {
    VpnAccess,
    VpnIpProtocolNumber,
    VpnRpcAddAccess,
    VpnRpcDeleteAccess,
    VpnRpcEnumAccessList,
    VpnServerRpc,
} from "vpnrpc";

import VpnAccessDataIPv4 from "./SoftEtherData/VpnAccessDataIPv4";
import VpnAccessDataIPv6 from "./SoftEtherData/VpnAccessDataIPv6";

// Access List
export default class SoftEtherAl {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async addAlIpv4(
        hubName: string,
        va: VpnAccessDataIPv4
    ): Promise<VpnRpcAddAccess> {
        let data = new VpnRpcAddAccess({
            HubName_str: hubName,
            AccessListSingle: [new VpnAccess(va)],
        });
        return await this.api.AddAccess(data);
    }

    public async addAlIpv6(
        hubName: string,
        va: VpnAccessDataIPv6
    ): Promise<VpnRpcAddAccess> {
        let data: VpnRpcAddAccess = new VpnRpcAddAccess({
            HubName_str: hubName,
            AccessListSingle: [new VpnAccess(va)],
        });
        return await this.api.AddAccess(data);
    }

    public async delete(
        hubName: string,
        id: number
    ): Promise<VpnRpcDeleteAccess> {
        let data = new VpnRpcDeleteAccess({
            HubName_str: hubName,
            Id_u32: id,
        });
        return await this.api.DeleteAccess(data);
    }

    public async list(hubName: string): Promise<VpnRpcEnumAccessList> {
        let data = new VpnRpcEnumAccessList({
            HubName_str: hubName,
        });
        return await this.api.EnumAccess(data);
    }

    public async update(
        hubName: string,
        va4?: VpnAccessDataIPv4,
        va6?: VpnAccessDataIPv6
    ): Promise<VpnRpcEnumAccessList> {
        let acl = [];
        if (va4) {
            acl.push(new VpnAccess(va4));
        }
        if (va6) {
            acl.push(new VpnAccess(va6));
        }

        let data = new VpnRpcEnumAccessList({
            HubName_str: hubName,
            AccessList: acl,
        });
        return await this.api.SetAccessList(data);
    }
}
