import * as VPN from "vpnrpc";
import SoftEtherACl from "./SoftEtherACl";
import SoftEtherHub from "./SoftEtherHub";
import SoftEtherUser from "./SoftEtherUser";
import SoftEtherGroup from "./SoftEtherGroup";
import SoftEtherIPSec from "./SoftEtherIPSec";

export default class SoftEtherAPI {
    protected api: VPN.VpnServerRpc;
    public hub: SoftEtherHub;
    public user: SoftEtherUser;
    public acl: SoftEtherACl;
    public group: SoftEtherGroup;
    public ipsec: SoftEtherIPSec;

    constructor(
        localhost: string,
        port: number,
        password: string,
        hubName: string = "",
        rejectUntrustCert: boolean = false,
        debug: boolean = true
    ) {
        VPN.VpnServerRpc.SetDebugMode(debug);
        this.api = new VPN.VpnServerRpc(
            localhost,
            port,
            hubName,
            password,
            rejectUntrustCert
        );
        this.user = new SoftEtherUser(this);
        this.hub = new SoftEtherHub(this);
        this.acl = new SoftEtherACl(this);
        this.group = new SoftEtherGroup(this);
        this.ipsec = new SoftEtherIPSec(this);
    }

    public async getServerInfo(): Promise<VPN.VpnRpcServerInfo> {
        return await this.api.GetServerInfo();
    }

    public async getServerStatus(): Promise<VPN.VpnRpcServerStatus> {
        return await this.api.GetServerStatus();
    }

    public async save(): Promise<void> {
        let in_rpc_test: VPN.VpnRpcTest = new VPN.VpnRpcTest(
            {
            });
        await this.api.Flush(in_rpc_test);
    }

    public getApi() {
        return this.api;
    }
}
