// RUN THIS ONLY VIA NPX

async function command(prisma, VPN_PASSWORD, args) {
    await prisma.server.create({
        data: {
            name: args[1],
        },
    });
    return true;
}

module.exports = { command };
