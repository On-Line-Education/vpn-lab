require("dotenv").config({ path: __dirname + "/../../.env" });
const createAdmin = require("./createAdmin.cjs");
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
    "create:admin": {
        command: "create:admin",
        info: "Create admin account",
        exec: createAdmin,
    },
};
(async () => {
    if (args.length > 0) {
        if (Object.keys(commands).includes(args[0])) {
            return await commands[args[0]].exec.command(prisma, vpn, args);
        }
    }

    let help = [];
    Object.entries(commands).forEach((entry) => {
        help.push({ command: entry[1].command, info: entry[1].info });
    });
    console.table(help);
})()
    .then((result) => console.log(result))
    .catch((err) => console.error(err));
