import ResolversBuilder from "./Resolvers/ResolversBuilder";
import createServer from "./server";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";

async function main(): Promise<void> {
    let vpn = new SoftEtherAPI("127.0.0.1", 5555, "!@#$%^&*");

    // let vpn = new SoftEtherAPI("127.0.0.1", 5555, "test123", 'test1');

    // vpn.hub.createHub("test1", VPN.VpnRpcHubType.Standalone, true, 64, "test123").then(e=>{console.dir(e)});
    let e = await vpn.hub.getHub("test1");
    console.dir(e);
    let rb = new ResolversBuilder();
    await createServer(rb);
}

main().then((_) => {
    console.log("System shut down!");
});
