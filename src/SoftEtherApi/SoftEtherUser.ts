import { VpnRpcEnumUser, VpnRpcSetUser, VpnRpcUserAuthType, VpnServerRpc } from "vpnrpc";

export default class SoftEtherUser {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async createUser(hubName: string, userName: string, fullName: string, authType: VpnRpcUserAuthType, password: string){

        let data: VpnRpcSetUser = new VpnRpcSetUser(
            {
                HubName_str: hubName,
                Name_str: userName,
                Realname_utf: fullName,
                AuthType_u32: authType,
                Auth_Password_str: password
            }
        );

        return await this.api.CreateUser(data);
    }

    public async getUser(hubName: string, userName: string) {
        let data: VpnRpcSetUser = new VpnRpcSetUser({
            HubName_str: hubName,
            Name_str: userName
        });

        return await this.api.GetUser(data);
    }

    public async getUsersList(hubName: string) {
        let data: VpnRpcEnumUser = new VpnRpcEnumUser(
            {
                HubName_str: hubName,
            });
        return await this.api.EnumUser(data);
    }
}
