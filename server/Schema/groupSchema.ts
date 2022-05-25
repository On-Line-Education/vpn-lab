import { gql } from "apollo-server-express";

export default gql`
    type Group {
        HubName_str: String!
        Name_str: String!
        Realname_utf: String
        Note_utf: String
        UsePolicy_bool: Boolean
        policyAccess_bool: Boolean
        policyDHCPFilter_bool: Boolean
        policyDHCPNoServer_bool: Boolean
        policyDHCPForce_bool: Boolean
        policyNoBridge_bool: Boolean
        policyNoRouting_bool: Boolean
        policyCheckMac_bool: Boolean
        policyCheckIP_bool: Boolean
        policyArpDhcpOnly_bool: Boolean
        policyPrivacyFilter_bool: Boolean
        policyNoServer_bool: Boolean
        policyNoBroadcastLimiter_bool: Boolean
        policyMonitorPort_bool: Boolean
        policyMaxConnection_u32: Int
        policyTimeOut_u32: Int
        policyMaxMac_u32: Int
        policyMaxIP_u32: Int
        policyMaxUpload_u32: Int
        policyMaxDownload_u32: Int
        policyFixPassword_bool: Boolean
        policyMultiLogins_u32: Int
        policyNoQoS_bool: Boolean
        policyRSandRAFilter_bool: Boolean
        policyRAFilter_bool: Boolean
        policyDHCPv6Filter_bool: Boolean
        policyDHCPv6NoServer_bool: Boolean
        policyNoRoutingV6_bool: Boolean
        policyCheckIPv6_bool: Boolean
        policyNoServerV6_bool: Boolean
        policyMaxIPv6_u32: Int
        policyNoSavePassword_bool: Boolean
        policyAutoDisconnect_u32: Int
        policyFilterIPv4_bool: Boolean
        policyFilterIPv6_bool: Boolean
        policyFilterNonIP_bool: Boolean
        policyNoIPv6DefaultRouterInRA_bool: Boolean
        policyNoIPv6DefaultRouterInRAWhenIPv6_bool: Boolean
        policyVLanId_u32: Int
        policyVer3_bool: Boolean
    }

    input GroupInput {
        HubName_str: String!
        Name_str: String!
        Realname_utf: String
        Note_utf: String
        UsePolicy_bool: Boolean
        policyAccess_bool: Boolean
        policyDHCPFilter_bool: Boolean
        policyDHCPNoServer_bool: Boolean
        policyDHCPForce_bool: Boolean
        policyNoBridge_bool: Boolean
        policyNoRouting_bool: Boolean
        policyCheckMac_bool: Boolean
        policyCheckIP_bool: Boolean
        policyArpDhcpOnly_bool: Boolean
        policyPrivacyFilter_bool: Boolean
        policyNoServer_bool: Boolean
        policyNoBroadcastLimiter_bool: Boolean
        policyMonitorPort_bool: Boolean
        policyMaxConnection_u32: Int
        policyTimeOut_u32: Int
        policyMaxMac_u32: Int
        policyMaxIP_u32: Int
        policyMaxUpload_u32: Int
        policyMaxDownload_u32: Int
        policyFixPassword_bool: Boolean
        policyMultiLogins_u32: Int
        policyNoQoS_bool: Boolean
        policyRSandRAFilter_bool: Boolean
        policyRAFilter_bool: Boolean
        policyDHCPv6Filter_bool: Boolean
        policyDHCPv6NoServer_bool: Boolean
        policyNoRoutingV6_bool: Boolean
        policyCheckIPv6_bool: Boolean
        policyNoServerV6_bool: Boolean
        policyMaxIPv6_u32: Int
        policyNoSavePassword_bool: Boolean
        policyAutoDisconnect_u32: Int
        policyFilterIPv4_bool: Boolean
        policyFilterIPv6_bool: Boolean
        policyFilterNonIP_bool: Boolean
        policyNoIPv6DefaultRouterInRA_bool: Boolean
        policyNoIPv6DefaultRouterInRAWhenIPv6_bool: Boolean
        policyVLanId_u32: Int
        policyVer3_bool: Boolean
    }

    type Query {
        listGroups(humName: String): [Group]
        createGroup(group: GroupInput): Group
        addUserToGroup(
            userName: String
            group: String
            hubName: String
        ): Boolean
        getGroupsInHub(hubName: String): [String]
    }
`;
