import { VpnServerRpc } from "vpnrpc";

export default class SoftEtherUser {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }
}
