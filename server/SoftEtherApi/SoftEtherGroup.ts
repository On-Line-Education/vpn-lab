import {
    VpnServerRpc,
    VpnRpcDeleteHub,
    VpnRpcSetGroup,
    VpnRpcEnumGroup,
    VpnRpcDeleteUser,
} from "vpnrpc";
import VpnGroup from "./SoftEtherData/VpnGroup";

export default class SoftEtherGroup {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async create(vpnGroup: VpnGroup): Promise<VpnRpcSetGroup> {
        let group = {
            HubName_str: vpnGroup.HubName_str,
            Name_str: vpnGroup.Name_str,
            Realname_utf: vpnGroup.Realname_utf,
            Note_utf: vpnGroup.Note_utf,
            UsePolicy_bool: vpnGroup.UsePolicy_bool,
        };

        if (!group.Realname_utf) {
            group.Realname_utf = group.Name_str;
        }

        Object.entries(this.graphQlToVpnPolicyData(vpnGroup)).forEach(
            ([key, value]) => {
                group[key] = value;
            }
        );

        let data: VpnRpcSetGroup = new VpnRpcSetGroup(group);
        return await this.api.CreateGroup(data);
    }

    public async list(hubName: string): Promise<VpnRpcEnumGroup> {
        let data: VpnRpcEnumGroup = new VpnRpcEnumGroup({
            HubName_str: hubName,
        });
        return await this.api.EnumGroup(data);
    }

    public async update(vpnGroup: VpnGroup): Promise<VpnRpcSetGroup> {
        let group = {
            HubName_str: vpnGroup.HubName_str,
            Name_str: vpnGroup.Name_str,
            Realname_utf: vpnGroup.Realname_utf,
            Note_utf: vpnGroup.Note_utf,
            UsePolicy_bool: vpnGroup.UsePolicy_bool,
        };

        if (!group.Realname_utf) {
            group.Realname_utf = group.Name_str;
        }

        Object.entries(this.graphQlToVpnPolicyData(vpnGroup)).forEach(
            ([key, value]) => {
                group[key] = value;
            }
        );

        let data: VpnRpcSetGroup = new VpnRpcSetGroup(group);
        return await this.api.SetGroup(data);
    }

    public async delete(
        hubName: string,
        groupName: string
    ): Promise<VpnRpcDeleteHub> {
        let data: VpnRpcDeleteUser = new VpnRpcDeleteUser({
            HubName_str: hubName,
            Name_str: groupName,
        });
        return await this.api.DeleteGroup(data);
    }

    protected graphQlToVpnPolicyData(vpnGroup: VpnGroup): any {
        return {
            ["policy:Access_bool"]: vpnGroup.policyAccess_bool,
            ["policy:DHCPFilter_bool"]: vpnGroup.policyDHCPFilter_bool,
            ["policy:DHCPNoServer_bool"]: vpnGroup.policyDHCPNoServer_bool,
            ["policy:DHCPForce_bool"]: vpnGroup.policyDHCPForce_bool,
            ["policy:NoBridge_bool"]: vpnGroup.policyNoBridge_bool,
            ["policy:NoRouting_bool"]: vpnGroup.policyNoRouting_bool,
            ["policy:CheckMac_bool"]: vpnGroup.policyCheckMac_bool,
            ["policy:CheckIP_bool"]: vpnGroup.policyCheckIP_bool,
            ["policy:ArpDhcpOnly_bool"]: vpnGroup.policyArpDhcpOnly_bool,
            ["policy:PrivacyFilter_bool"]: vpnGroup.policyPrivacyFilter_bool,
            ["policy:NoServer_bool"]: vpnGroup.policyNoServer_bool,
            ["policy:NoBroadcastLimiter_bool"]:
                vpnGroup.policyNoBroadcastLimiter_bool,
            ["policy:MonitorPort_bool"]: vpnGroup.policyMonitorPort_bool,
            ["policy:MaxConnection_u32"]: vpnGroup.policyMaxConnection_u32,
            ["policy:TimeOut_u32"]: vpnGroup.policyTimeOut_u32,
            ["policy:MaxMac_u32"]: vpnGroup.policyMaxMac_u32,
            ["policy:MaxIP_u32"]: vpnGroup.policyMaxIP_u32,
            ["policy:MaxUpload_u32"]: vpnGroup.policyMaxUpload_u32,
            ["policy:MaxDownload_u32"]: vpnGroup.policyMaxDownload_u32,
            ["policy:FixPassword_bool"]: vpnGroup.policyFixPassword_bool,
            ["policy:MultiLogins_u32"]: vpnGroup.policyMultiLogins_u32,
            ["policy:NoQoS_bool"]: vpnGroup.policyNoQoS_bool,
            ["policy:RSandRAFilter_bool"]: vpnGroup.policyRSandRAFilter_bool,
            ["policy:RAFilter_bool"]: vpnGroup.policyRAFilter_bool,
            ["policy:DHCPv6Filter_bool"]: vpnGroup.policyDHCPv6Filter_bool,
            ["policy:DHCPv6NoServer_bool"]: vpnGroup.policyDHCPv6NoServer_bool,
            ["policy:NoRoutingV6_bool"]: vpnGroup.policyNoRoutingV6_bool,
            ["policy:CheckIPv6_bool"]: vpnGroup.policyCheckIPv6_bool,
            ["policy:NoServerV6_bool"]: vpnGroup.policyNoServerV6_bool,
            ["policy:MaxIPv6_u32"]: vpnGroup.policyMaxIPv6_u32,
            ["policy:NoSavePassword_bool"]: vpnGroup.policyNoSavePassword_bool,
            ["policy:AutoDisconnect_u32"]: vpnGroup.policyAutoDisconnect_u32,
            ["policy:FilterIPv4_bool"]: vpnGroup.policyFilterIPv4_bool,
            ["policy:FilterIPv6_bool"]: vpnGroup.policyFilterIPv6_bool,
            ["policy:FilterNonIP_bool"]: vpnGroup.policyFilterNonIP_bool,
            ["policy:NoIPv6DefaultRouterInRA_bool"]:
                vpnGroup.policyNoIPv6DefaultRouterInRA_bool,
            ["policy:NoIPv6DefaultRouterInRAWhenIPv6_bool"]:
                vpnGroup.policyNoIPv6DefaultRouterInRAWhenIPv6_bool,
            ["policy:VLanId_u32"]: vpnGroup.policyVLanId_u32,
            ["policy:Ver3_bool"]: vpnGroup.policyVer3_bool,
        };
    }
}
