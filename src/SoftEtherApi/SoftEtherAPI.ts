import * as VPN from "vpnrpc";
import SoftEtherHub from "./SoftEtherHub";
import SoftEtherUser from "./SoftEtherUser";

export default class SoftEtherAPI {
    protected api: VPN.VpnServerRpc;
    public hub: SoftEtherHub;
    public user: SoftEtherUser;

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
    }
}
