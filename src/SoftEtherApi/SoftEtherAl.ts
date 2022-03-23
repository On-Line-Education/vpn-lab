import {
    VpnAccess,
    VpnIpProtocolNumber,
    VpnRpcAddAccess,
    VpnRpcDeleteAccess,
    VpnRpcEnumAccessList,
    VpnServerRpc,
} from "vpnrpc";

// Access List
export default class SoftEtherAl {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async addAlIpv4(hubName: string): Promise<VpnRpcAddAccess> {
        let data = new VpnRpcAddAccess({
            HubName_str: hubName,
            AccessListSingle: [
                new VpnAccess({
                    Note_utf: "IPv4 Test",
                    Active_bool: true,
                    Priority_u32: 100,
                    Discard_bool: true,
                    IsIPv6_bool: false,
                    SrcIpAddress_ip: "192.168.0.0",
                    SrcSubnetMask_ip: "255.255.255.0",
                    DestIpAddress_ip: "10.0.0.0",
                    DestSubnetMask_ip: "255.255.0.0",
                    Protocol_u32: VpnIpProtocolNumber.TCP,
                    SrcPortStart_u32: 123,
                    SrcPortEnd_u32: 456,
                    DestPortStart_u32: 555,
                    DestPortEnd_u32: 666,
                    SrcUsername_str: "dnobori",
                    DestUsername_str: "nekosan",
                    CheckSrcMac_bool: true,
                    SrcMacAddress_bin: new Uint8Array([1, 2, 3, 0, 0, 0]),
                    SrcMacMask_bin: new Uint8Array([255, 255, 255, 0, 0, 0]),
                    CheckTcpState_bool: true,
                    Established_bool: true,
                    Delay_u32: 10,
                    Jitter_u32: 20,
                    Loss_u32: 30,
                    RedirectUrl_str: "aho",
                }),
            ],
        });
        return await this.api.AddAccess(data);
    }

    public async addAlIpv6(hubName: string): Promise<VpnRpcAddAccess> {
        let data: VpnRpcAddAccess = new VpnRpcAddAccess({
            HubName_str: hubName,
            AccessListSingle: [
                new VpnAccess({
                    Note_utf: "IPv6 Test",
                    Active_bool: true,
                    Priority_u32: 100,
                    Discard_bool: true,
                    IsIPv6_bool: true,
                    SrcIpAddress6_bin: new Uint8Array([
                        0x20, 0x01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ]),
                    SrcSubnetMask6_bin: new Uint8Array([
                        0xff, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ]),
                    Protocol_u32: VpnIpProtocolNumber.UDP,
                    SrcPortStart_u32: 123,
                    SrcPortEnd_u32: 456,
                    DestPortStart_u32: 555,
                    DestPortEnd_u32: 666,
                    SrcUsername_str: "dnobori",
                    DestUsername_str: "nekosan",
                    CheckSrcMac_bool: true,
                    SrcMacAddress_bin: new Uint8Array([1, 2, 3, 0, 0, 0]),
                    SrcMacMask_bin: new Uint8Array([255, 255, 255, 0, 0, 0]),
                    CheckTcpState_bool: true,
                    Established_bool: true,
                    Delay_u32: 10,
                    Jitter_u32: 20,
                    Loss_u32: 30,
                    RedirectUrl_str: "aho",
                }),
            ],
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

    public async update(hubName: string): Promise<VpnRpcEnumAccessList> {
        let data = new VpnRpcEnumAccessList({
            HubName_str: hubName,
            AccessList: [
                new VpnAccess({
                    Note_utf: "IPv4 Test 2",
                    Active_bool: true,
                    Priority_u32: 100,
                    Discard_bool: true,
                    IsIPv6_bool: false,
                    SrcIpAddress_ip: "192.168.0.0",
                    SrcSubnetMask_ip: "255.255.255.0",
                    DestIpAddress_ip: "10.0.0.0",
                    DestSubnetMask_ip: "255.255.0.0",
                    Protocol_u32: VpnIpProtocolNumber.TCP,
                    SrcPortStart_u32: 123,
                    SrcPortEnd_u32: 456,
                    DestPortStart_u32: 555,
                    DestPortEnd_u32: 666,
                    SrcUsername_str: "dnobori",
                    DestUsername_str: "nekosan",
                    CheckSrcMac_bool: true,
                    SrcMacAddress_bin: new Uint8Array([1, 2, 3, 0, 0, 0]),
                    SrcMacMask_bin: new Uint8Array([255, 255, 255, 0, 0, 0]),
                    CheckTcpState_bool: true,
                    Established_bool: true,
                    Delay_u32: 10,
                    Jitter_u32: 20,
                    Loss_u32: 30,
                    RedirectUrl_str: "aho",
                }),
                new VpnAccess({
                    Note_utf: "IPv6 Test 2",
                    Active_bool: true,
                    Priority_u32: 100,
                    Discard_bool: true,
                    IsIPv6_bool: true,
                    SrcIpAddress6_bin: new Uint8Array([
                        0x20, 0x01, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ]),
                    SrcSubnetMask6_bin: new Uint8Array([
                        0xff, 0xff, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    ]),
                    Protocol_u32: VpnIpProtocolNumber.UDP,
                    SrcPortStart_u32: 123,
                    SrcPortEnd_u32: 456,
                    DestPortStart_u32: 555,
                    DestPortEnd_u32: 666,
                    SrcUsername_str: "dnobori",
                    DestUsername_str: "nekosan",
                    CheckSrcMac_bool: true,
                    SrcMacAddress_bin: new Uint8Array([1, 2, 3, 0, 0, 0]),
                    SrcMacMask_bin: new Uint8Array([255, 255, 255, 0, 0, 0]),
                    CheckTcpState_bool: true,
                    Established_bool: true,
                    Delay_u32: 10,
                    Jitter_u32: 20,
                    Loss_u32: 30,
                    RedirectUrl_str: "aho",
                }),
            ],
        });
        return await this.api.SetAccessList(data);
    }
}
