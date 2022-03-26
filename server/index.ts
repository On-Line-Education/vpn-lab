import { VpnRpcHubType, VpnRpcUserAuthType } from "vpnrpc";
import ResolversBuilder from "./Resolvers/ResolversBuilder";
import createServer from "./server";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";
import faker from "@faker-js/faker";

async function main(): Promise<void> {
    let vpn = new SoftEtherAPI("127.0.0.1", 5555, "!@#$%^&*");
    // let vpn = new SoftEtherAPI("127.0.0.1", 5555, "test123", 'test1');

    // console.log(vpn.hub.create("test1", VPN.VpnRpcHubType.Standalone, true, 64, "test123").then(e=>{console.dir(e)});
    console.log(await vpn.hub.get("test1"));
    // console.log(
    //     await vpn.hub.create(
    //         "test1",
    //         VpnRpcHubType.Standalone,
    //         true,
    //         64,
    //         "test123"
    //     )
    // );
    // console.log(await vpn.user.createUser("test1", "arnold", "szfajceneger", VpnRpcUserAuthType.Password, "1234"));
    // console.log(await vpn.user.getUsersList("test1"));
    // console.log(
    //     await vpn.user.update("test1", "BOrland", "Wichajster", "", "")
    // );
    // console.log(await vpn.user.getUsersList("test1"));
    // console.dir(e);

    let rb = new ResolversBuilder();
    await createServer(rb);
}

main().then((_) => {
    console.log("System shut down!");
});
