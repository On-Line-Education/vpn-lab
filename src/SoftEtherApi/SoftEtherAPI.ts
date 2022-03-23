import * as VPN from "vpnrpc";
import SoftEtherAl from "./SoftEtherAl";
import SoftEtherHub from "./SoftEtherHub";
import SoftEtherUser from "./SoftEtherUser";

export default class SoftEtherAPI {
    protected api: VPN.VpnServerRpc;
    public hub: SoftEtherHub;
    public user: SoftEtherUser;
    public al: SoftEtherAl;

    constructor(
        localhost: string,
        port: number,
        password: string,
        hubName: string = "",
        rejectUntrustCert: boolean = false
    ) {
        VPN.VpnServerRpc.SetDebugMode(true);
        this.api = new VPN.VpnServerRpc(
            localhost,
            port,
            hubName,
            password,
            rejectUntrustCert
        );
        this.user = new SoftEtherUser(this.api);
        this.hub = new SoftEtherHub(this.api);
        this.al = new SoftEtherAl(this.api);
    }

    public async getServerInfo(): Promise<VPN.VpnRpcServerInfo> {
        return await this.api.GetServerInfo();
    }

    public async getServerStatus(): Promise<VPN.VpnRpcServerStatus> {
        return await this.api.GetServerStatus();
    }
}
