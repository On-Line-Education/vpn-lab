import { AuthenticationError } from "apollo-server-express";
import { VpnIpProtocolNumber } from "vpnrpc";
import Roles from "../Helpsers/roles";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getHubAccessLists(_: any, { hubName }: any, { user, api }) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if(user && ![Roles.ADMIN].includes(user.role)){
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                return JSON.stringify(await vpn.acl.list(hubName));
            },
        },
        Mutation: {
            async addHubAccessList(
                _: any,
                { hubName, accessList }: any,
                { user, api }
            ) {
                if (!(api || user)) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if(user && ![Roles.ADMIN].includes(user.role)){
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                if (accessList.SrcMacMask_bin) {
                    accessList.SrcMacMask_bin = new Uint8Array(
                        accessList.SrcMacMask_bin
                    );
                }
                if (accessList.SrcMacAddress_bin) {
                    accessList.SrcMacAddress_bin = new Uint8Array(
                        accessList.SrcMacAddress_bin
                    );
                }
                // if (accessList.SrcIpAddress6_bin) {
                //     accessList.SrcMacAddress_bin = new Uint8Array(
                //         accessList.SrcMacAddress_bin
                //     );
                // }
                // if (accessList.SrcSubnetMask6_bin) {
                //     accessList.SrcMacAddress_bin = new Uint8Array(
                //         accessList.SrcMacAddress_bin
                //     );
                // }
                if (accessList.SrcSubnetMask6_bin) {
                    accessList.SrcSubnetMask6_bin = new Uint8Array(
                        accessList.SrcSubnetMask6_bin
                    );
                }
                if (accessList.SrcIpAddress6_bin) {
                    accessList.SrcIpAddress6_bin = new Uint8Array(
                        accessList.SrcIpAddress6_bin
                    );
                }
                if (accessList.IsIPv6_bool) {
                    return JSON.stringify(
                        await vpn.acl.addAlIpv6(hubName, accessList)
                    );
                } else {
                    return JSON.stringify(
                        await vpn.acl.addAlIpv4(hubName, accessList)
                    );
                }
            },
        },
        Protocol: {
            TCP: VpnIpProtocolNumber.TCP,
            UDP: VpnIpProtocolNumber.UDP,
        },
    };
};
