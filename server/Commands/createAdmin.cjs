// RUN THIS ONLY VIA NPX
const VPN = require("vpnrpc");
const crypto = require("crypto");

async function command(prisma, vpn, args) {
    await prisma.user.create({
        data: {
            name: "admin",
            role: "admin",
            passHash: crypto.createHash("SHA256").update(args[1]).digest("hex"),
            veyonKeyPriv: null,
            veyonKeyPub: null,
            loginKey: crypto.createHash("SHA256").update(args[1]).digest("hex"),
            vpnPass: "",
        },
    });
    return true;
}

module.exports = { command };
