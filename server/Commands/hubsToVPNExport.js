// RUN THIS ONLY VIA NPX
const VPN = require("vpnrpc");

async function command(prisma, vpn, args) {
    let hubs = await prisma.hub.findMany();
    for (let index in hubs) {
        
    }
    // TODO: hub.passHash
}

module.exports = { command };
