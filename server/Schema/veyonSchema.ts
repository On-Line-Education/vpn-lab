import { gql } from "apollo-server-express";

export default gql`
    type SecureNATOption {
        RpcHubName_str: String
        MacAddress_bin: String
        Ip_ip: String
        Mask_ip: String
        UseNat_bool: Boolean
        Mtu_u32: Int
        NatTcpTimeout_u32: Int
        NatUdpTimeout_u32: Int
        UseDhcp_bool: Boolean
        DhcpLeaseIPStart_ip: String
        DhcpLeaseIPEnd_ip: String
        DhcpSubnetMask_ip: String
        DhcpExpireTimeSpan_u32: Int
        DhcpGatewayAddress_ip: String
        DhcpDnsServerAddress_ip: String
        DhcpDnsServerAddress2_ip: String
        DhcpDomainName_str: String
        SaveLog_bool: Boolean
        ApplyDhcpPushRoutes_bool: Boolean
        DhcpPushRoutes_str: String
    }

    type VeyonKeys {
        pubKey: String
        privKey: String
        secureNATOption: SecureNATOption
    }

    type IPSec {
        L2TP_Raw_bool: Boolean,
        L2TP_IPsec_bool: Boolean,
        EtherIP_IPsec_bool: Boolean,
        IPsec_Secret_str: String,
        L2TP_DefaultHub_str: String
    }

    type Query {
        getVeyonKeys(hubName: String, username: String): VeyonKeys
        changeUserGroupToTeacher(
            studentName: String
            teacherName: String
        ): Boolean
        getIpSec: IPSec
    }
`;
