import { VpnRpcHubType, VpnRpcUserAuthType } from "vpnrpc";
import ResolversBuilder from "./Resolvers/ResolversBuilder";
import createServer from "./server";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";
import faker from "@faker-js/faker";

require("dotenv").config({ path: __dirname + "/../../.env" });

async function main(): Promise<void> {
    console.log(
        process.env.VPN_HOST,
        parseInt(process.env.VPN_PORT),
        process.env.VPN_PASSWORD
    );
    let vpn = new SoftEtherAPI(
        process.env.VPN_HOST,
        parseInt(process.env.VPN_PORT),
        process.env.VPN_PASSWORD
    );

    if (parseInt(process.env.develop) == 1) {
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
    }

    let rb = new ResolversBuilder();
    await createServer(rb, vpn);
}

main().then((_) => {
    console.log("System shut down!");
});
