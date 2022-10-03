import { VpnServerRpc, VpnIPsecServices } from "vpnrpc";
import SoftEtherAPI from "./SoftEtherAPI";

export default class SoftEtherIPSec {
    protected api: VpnServerRpc;
    protected parent: SoftEtherAPI;
    constructor(parent: SoftEtherAPI) {
        this.api = parent.getApi();
        this.parent = parent;
    }

    public async set(
        L2TP_Raw_bool: boolean = false,
        L2TP_IPsec_bool: boolean = false,
        EtherIP_IPsec_bool: boolean = false,
        IPsec_Secret_str: string,
        L2TP_DefaultHub_str: string
    ): Promise<VpnIPsecServices> {
        let config = await this.get();
        config.L2TP_Raw_bool = L2TP_Raw_bool;
        config.EtherIP_IPsec_bool = EtherIP_IPsec_bool;
        config.IPsec_Secret_str = IPsec_Secret_str;
        config.L2TP_DefaultHub_str = L2TP_DefaultHub_str;
        return await this.api.SetIPsecServices(config);
    }

    public async get(): Promise<VpnIPsecServices> {
        return await this.api.GetIPsecServices();
    }
}
