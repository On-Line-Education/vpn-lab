import ResolversBuilder from "./Resolvers/resolversBuilder";
import createServer from "./server";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";

require("dotenv").config({ path: __dirname + "/../../.env" });

async function main(): Promise<void> {
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
    console.log("System is running!");
});
