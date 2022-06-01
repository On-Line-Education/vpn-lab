import {
    VpnServerRpc,
    VpnRpcCreateHub,
    VpnRpcHubType,
    VpnRpcHubStatus,
    VpnRpcEnumHub,
    VpnRpcDeleteHub,
    VpnRpcSetHubOnline,
    VpnRpcSetGroup,
    VpnRpcEnumGroup,
    VpnRpcDeleteUser,
    VpnIPsecServices,
} from "vpnrpc";

export default class SoftEtherIPSec {
    protected api: VpnServerRpc;
    constructor(api: VpnServerRpc) {
        this.api = api;
    }

    public async create(L2TP_Raw_bool: boolean = false,
        L2TP_IPsec_bool: boolean = false,
        EtherIP_IPsec_bool: boolean = false,
        IPsec_Secret_str: string,
        L2TP_DefaultHub_str: string): Promise<VpnIPsecServices> {
        let in_ipsec_services: VpnIPsecServices = new VpnIPsecServices(
            {
                L2TP_Raw_bool,
                L2TP_IPsec_bool,
                EtherIP_IPsec_bool,
                IPsec_Secret_str,
                L2TP_DefaultHub_str,
            });
            return await this.api.SetIPsecServices(in_ipsec_services);
    }

    public async get(): Promise<VpnIPsecServices> {
        return await this.api.GetIPsecServices();
    }
}
