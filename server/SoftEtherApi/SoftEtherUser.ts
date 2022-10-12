import {
    VpnRpcDeleteUser,
    VpnRpcEnumUser,
    VpnRpcSetUser,
    VpnRpcUserAuthType,
    VpnServerRpc,
} from "vpnrpc";
import SoftEtherAPI from "./SoftEtherAPI";
import VpnGroup from "./SoftEtherData/VpnGroup";

export default class SoftEtherUser {
    protected api: VpnServerRpc;
    protected parent: SoftEtherAPI;
    constructor(parent: SoftEtherAPI) {
        this.api = parent.getApi();
        this.parent = parent;
    }

    public async createUser(
        hubName: string,
        userName: string,
        fullName: string,
        authType: VpnRpcUserAuthType,
        password: string,
        groupName: string = null
    ) {
        let data: VpnRpcSetUser = new VpnRpcSetUser({
            HubName_str: hubName,
            Name_str: userName,
            Realname_utf: fullName,
            AuthType_u32: authType,
            Auth_Password_str: password,
            ExpireTime_dt: null,
            GroupName_str: groupName,
            UsePolicy_bool: false,
        });

        if (groupName != null) {
            let groupList = await this.parent.group.list(hubName),
                flag = false;
            for (let index in groupList.GroupList) {
                if (
                    groupList.GroupList[index].Name_str == groupName ||
                    groupList.GroupList[index].Realname_utf == groupName
                ) {
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                let groupData = new VpnGroup();

                groupData = {
                    ...groupData,
                    HubName_str: hubName,
                    Name_str: groupName,
                    Realname_utf: groupName,
                    Note_utf: userName + "_" + fullName,
                    UsePolicy_bool: false,
                };
                await this.parent.group.create(groupData);
            }
        }

        return await this.api.CreateUser(data);
    }

    public async getUser(hubName: string, userName: string) {
        let data: VpnRpcSetUser = new VpnRpcSetUser({
            HubName_str: hubName,
            Name_str: userName,
        });

        return await this.api.GetUser(data);
    }

    public async getUsersList(hubName: string) {
        let data: VpnRpcEnumUser = new VpnRpcEnumUser({
            HubName_str: hubName,
        });
        return await this.api.EnumUser(data);
    }

    public async setGroup(
        hubName: string,
        userName: string,
        groupName: string,
        authType: VpnRpcUserAuthType,
        password: string
    ): Promise<VpnRpcSetUser> {
        let user = await this.getUser(hubName, userName);
        user.AuthType_u32 = authType;
        user.Auth_Password_str = password;
        user.GroupName_str = groupName;
        return await this.api.SetUser(user);
    }

    public async deleteUser(
        hubname: string,
        username: string
    ): Promise<VpnRpcDeleteUser> {
        let in_rpc_delete_user: VpnRpcDeleteUser = new VpnRpcDeleteUser({
            HubName_str: hubname,
            Name_str: username,
        });
        return await this.api.DeleteUser(in_rpc_delete_user);
    }

    public async update(hubName: string, oldName: string, userName: string) {
        let user: VpnRpcSetUser = await this.getUser(hubName, oldName);
        user.Name_str = userName != oldName ? userName : user.Name_str;
        // let data = new VpnRpcSetUser({
        //     HubName_str: hub_name,
        //     Name_str: "test1",
        //     Realname_utf: "Cat man",
        //     Note_utf: "Hey!!!",
        //     GroupName_str: "group1",
        //     AuthType_u32: VPN.VpnRpcUserAuthType.Anonymous,
        //     Auth_Password_str: "",
        //     UserX_bin: new Uint8Array([]),
        //     Serial_bin: new Uint8Array([]),
        //     CommonName_utf: "",
        //     RadiusUsername_utf: "",
        //     NtUsername_utf: "",
        //     ExpireTime_dt: new Date(2019, 1, 1),
        //     UsePolicy_bool: true,
        //     ["policy:Access_bool"]: true,
        //     ["policy:DHCPFilter_bool"]: false,
        //     ["policy:DHCPNoServer_bool"]: true,
        //     ["policy:DHCPForce_bool"]: false,
        //     ["policy:NoBridge_bool"]: false,
        //     ["policy:NoRouting_bool"]: false,
        //     ["policy:CheckMac_bool"]: false,
        //     ["policy:CheckIP_bool"]: false,
        //     ["policy:ArpDhcpOnly_bool"]: false,
        //     ["policy:PrivacyFilter_bool"]: false,
        //     ["policy:NoServer_bool"]: false,
        //     ["policy:NoBroadcastLimiter_bool"]: false,
        //     ["policy:MonitorPort_bool"]: false,
        //     ["policy:MaxConnection_u32"]: 32,
        //     ["policy:TimeOut_u32"]: 15,
        //     ["policy:MaxMac_u32"]: 1000,
        //     ["policy:MaxIP_u32"]: 1000,
        //     ["policy:MaxUpload_u32"]: 1000000000,
        //     ["policy:MaxDownload_u32"]: 1000000000,
        //     ["policy:FixPassword_bool"]: false,
        //     ["policy:MultiLogins_u32"]: 1000,
        //     ["policy:NoQoS_bool"]: false,
        //     ["policy:RSandRAFilter_bool"]: false,
        //     ["policy:RAFilter_bool"]: false,
        //     ["policy:DHCPv6Filter_bool"]: false,
        //     ["policy:DHCPv6NoServer_bool"]: false,
        //     ["policy:NoRoutingV6_bool"]: false,
        //     ["policy:CheckIPv6_bool"]: false,
        //     ["policy:NoServerV6_bool"]: false,
        //     ["policy:MaxIPv6_u32"]: 1234,
        //     ["policy:NoSavePassword_bool"]: false,
        //     ["policy:AutoDisconnect_u32"]: 0,
        //     ["policy:FilterIPv4_bool"]: false,
        //     ["policy:FilterIPv6_bool"]: false,
        //     ["policy:FilterNonIP_bool"]: false,
        //     ["policy:NoIPv6DefaultRouterInRA_bool"]: false,
        //     ["policy:NoIPv6DefaultRouterInRAWhenIPv6_bool"]: false,
        //     ["policy:VLanId_u32"]: 0,
        //     ["policy:Ver3_bool"]: true,
        // });
        return await this.api.SetUser(user);
    }
}
