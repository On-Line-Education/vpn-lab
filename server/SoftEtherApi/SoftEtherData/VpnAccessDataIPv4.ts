import { VpnIpProtocolNumber } from "vpnrpc";

export default class {
    Note_utf: string;
    Active_bool: boolean;
    Priority_u32: number;
    Discard_bool: boolean;
    IsIPv6_bool: boolean;
    SrcIpAddress_ip: string;
    SrcSubnetMask_ip: string;
    DestIpAddress_ip: string;
    DestSubnetMask_ip: string;
    Protocol_u32: number;
    SrcPortStart_u32: number;
    SrcPortEnd_u32: number;
    DestPortStart_u32: number;
    DestPortEnd_u32: number;
    SrcUsername_str: string;
    DestUsername_str: string;
    CheckSrcMac_bool: boolean;
    CheckTcpState_bool: boolean;
    Established_bool: boolean;
    Delay_u32: number;
    Jitter_u32: number;
    Loss_u32: number;
    RedirectUrl_str: string;
    SrcMacMask_bin: Uint8Array;
    SrcMacAddress_bin: Uint8Array;
}

export function example() {
    return {
        Note_utf: "",
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
        RedirectUrl_str: "",
    };
}
