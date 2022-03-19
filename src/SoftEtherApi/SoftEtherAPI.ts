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
        hub_name: string = "",
        reject_untrust_cert: boolean = false
    ) {
        VPN.VpnServerRpc.SetDebugMode(true);
        this.api = new VPN.VpnServerRpc(
            localhost,
            port,
            hub_name,
            password,
            reject_untrust_cert
        );
        this.user = new SoftEtherUser(this.api);
        this.hub = new SoftEtherHub(this.api);
    }
}
