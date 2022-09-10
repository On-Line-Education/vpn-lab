// RUN THIS ONLY VIA NPX
const VPN = require("vpnrpc");
const crypto = require("crypto");

async function command(prisma, vpn, args) {
    let password = args[1];
    if (args.length > 2) {
        password = args[2];
    }
    await prisma.user.create({
        data: {
            name: args[1],
            username: args[1],
            role: "admin",
            passHash: crypto
                .createHash("SHA256")
                .update(password)
                .digest("hex"),
            veyonKeyPriv: null,
            veyonKeyPub: null,
            vpnPass: "",
        },
    });
    return true;
}

module.exports = { command };
