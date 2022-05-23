import { gql } from "apollo-server-express";

export default gql`
    input AccessDataIPv4 {
        Note_utf: String
        Active_bool: Boolean
        Priority_u32: Int
        Discard_bool: Boolean
        SrcIpAddress_ip: String
        SrcSubnetMask_ip: String
        DestIpAddress_ip: String
        DestSubnetMask_ip: String
        Protocol_u32: Protocol
        SrcPortStart_u32: Int
        SrcPortEnd_u32: Int
        DestPortStart_u32: Int
        DestPortEnd_u32: Int
        SrcUsername_str: String
        DestUsername_str: String
        CheckSrcMac_bool: Boolean
        CheckTcpState_bool: Boolean
        Established_bool: Boolean
        Delay_u32: Int
        Jitter_u32: Int
        Loss_u32: Int
        RedirectUrl_str: String
        SrcMacMask_bin: [Int]
        SrcMacAddress_bin: [Int]
    }

    input AccessDataIPv6 {
        Note_utf: String
        Active_bool: Boolean
        Priority_u32: Int
        Discard_bool: Boolean
        Protocol_u32: Protocol
        SrcPortStart_u32: Int
        SrcPortEnd_u32: Int
        DestPortStart_u32: Int
        DestPortEnd_u32: Int
        SrcUsername_str: String
        DestUsername_str: String
        CheckSrcMac_bool: Boolean
        CheckTcpState_bool: Boolean
        Established_bool: Boolean
        Delay_u32: Int
        Jitter_u32: Int
        Loss_u32: Int
        RedirectUrl_str: String
        SrcMacMask_bin: [Int]
        SrcMacAddress_bin: [Int]
        SrcSubnetMask6_bin: [String]
        SrcIpAddress6_bin: [String]
    }

    input AccessListData {
        Note_utf: String
        Active_bool: Boolean
        Priority_u32: Int
        Discard_bool: Boolean
        IsIPv6_bool: Boolean
        SrcIpAddress_ip: String
        SrcSubnetMask_ip: String
        DestIpAddress_ip: String
        DestSubnetMask_ip: String
        Protocol_u32: Protocol
        SrcPortStart_u32: Int
        SrcPortEnd_u32: Int
        DestPortStart_u32: Int
        DestPortEnd_u32: Int
        SrcUsername_str: String
        DestUsername_str: String
        CheckSrcMac_bool: Boolean
        CheckDstMac_bool: Boolean
        DstMacAddress_bin: String
        DstMacMask_bin: String
        CheckTcpState_bool: Boolean
        Established_bool: Boolean
        Delay_u32: Int
        Jitter_u32: Int
        Loss_u32: Int
        RedirectUrl_str: String
        SrcMacMask_bin: [Int]
        SrcMacAddress_bin: [Int]
        DestSubnetMask6_bin: ByteArray
        DestIpAddress6_bin: ByteArray
        SrcSubnetMask6_bin: ByteArray
        SrcIpAddress6_bin: ByteArray
    }

    type Query {
        getHubAccessLists(hubName: String): String
        addHubAccessList(hubName: String, accessList: AccessListData): String
    }

    scalar ByteArray

    enum Protocol {
        TCP
        UDP
    }
`;
