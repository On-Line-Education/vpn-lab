require("dotenv").config({ path: __dirname + "/../../.env" });
const hubsToVPNExport = require("./hubsToVPNExport.js");
const { PrismaClient } = require("@prisma/client");
const VPN = require("vpnrpc");
const prisma = new PrismaClient();
const vpn = new VPN.VpnServerRpc(
    process.env.VPN_HOST,
    parseInt(process.env.VPN_PORT),
    "",
    process.env.VPN_PASSWORD,
    false
);

let args = process.argv.splice(2);

let commands = {
    "export:hubs:to:vpn": {
        command: "export:hubs:to:vpn",
        info: "Exports hubs in database to VPN",
        exec: hubsToVPNExport,
    },
};
(async () => {
    let showHelp = true;
    if (args.length > 0) {
        if (Object.keys(commands).includes(args[0])) {
            await commands[args[0]].exec.command(prisma, vpn, args);
            showHelp = false;
        }
    }

    if (showHelp) {
        let help = [];
        Object.entries(commands).forEach((entry) => {
            help.push({ command: entry[1].command, info: entry[1].info });
        });
        console.table(help);
    }
})()
    .then((result) => console.log(result))
    .catch((err) => console.error(err));
