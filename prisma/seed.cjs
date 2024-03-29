const { PrismaClient } = require("@prisma/client"),
    { faker } = require("@faker-js/faker"),
    crypto = require("crypto"),
    VPN = require("vpnrpc");

require("dotenv").config({ path: __dirname + "/../../.env" });

const vpn = new VPN.VpnServerRpc(
    process.env.VPN_HOST,
    parseInt(process.env.VPN_PORT),
    "",
    process.env.VPN_PASSWORD,
    false
);

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);
    let seedCount = 50;
    let usersInHub = 15;

    let hubs = [];

    let names = [];

    let fakeServer = {
        name: faker.random.alphaNumeric(8),
        presharedKey: faker.random.alphaNumeric(8),
    };

    let server = await prisma.server.create({
        data: fakeServer,
    });

    await prisma.user.create({
        data: {
            name: admin,
            passHash: crypto.createHash("SHA256").update("admin").digest("hex"),
            loginKey: crypto.createHash("SHA256").update("admin").digest("hex"),
            role: "admin",
        },
    });

    for (let i = 0; i < seedCount; i++) {
        let password = faker.random.alphaNumeric(8);
        let title = faker.lorem.word() + "_" + parseInt(Math.random() * 1000);

        let users = [];

        for (let j = 0; j < usersInHub; j++) {
            let password = faker.random.alphaNumeric(8);
            let name = faker.name.firstName();
            while (names.includes(name)) {
                name = faker.random.alpha(8);
            }
            names.push(name);
            let passcode = faker.random.alphaNumeric(16);
            let passHash = crypto
                .createHash("SHA256")
                .update(password)
                .digest("hex");
            let fakeUser = {
                name,
                passHash,
                // vpnName,
                role: "user",
                veyonKeyPub: faker.random.alphaNumeric(32),
                veyonKeyPriv: faker.random.alphaNumeric(32),
                loginKey: crypto
                    .createHash("SHA256")
                    .update(passcode)
                    .digest("hex"),
                password,
                passcode,
                token: {
                    token: faker.random.alphaNumeric(16),
                    expireOn: () => {
                        let dt = new Date(Date.now());
                        dt.setHours(dt.getHours() + 1);
                        return dt;
                    },
                },
            };
            console.dir("USER PASS: " + password);
            console.dir(fakeUser);
            users.push(fakeUser);
        }

        let fakeHub = {
            title,
            users: users,
            password,
        };
        console.dir("HUB PASS: " + password);
        console.dir(fakeHub);
        hubs.push(fakeHub);
    }
    console.log("ADDING HUBS");
    for (const h of hubs) {
        console.dir({
            data: {
                title: h.title,
                users: {
                    create: h.users.map((e) => {
                        return {
                            user: { connect: e },
                        };
                    }),
                },
                server: {
                    connect: { id: server.id },
                },
            },
        });
        console.dir({
            create: h.users.map((e) => {
                return {
                    user: { create: e },
                };
            }),
        });
        const hub = await prisma.hub.create({
            data: {
                title: h.title,
                passHash: h.passHash,
                users: {
                    create: h.users.map((e) => {
                        return {
                            user: {
                                create: {
                                    name: e.name,
                                    passHash: e.passHash,
                                    // vpnName: e.vpnName,
                                    role: e.role,
                                    veyonKeyPub: e.veyonKeyPub,
                                    veyonKeyPriv: e.veyonKeyPriv,
                                    loginKey: e.loginKey,
                                    Token: {
                                        create: {
                                            expireOn: e.token.expireOn(),
                                            token: e.token.token,
                                        },
                                    },
                                },
                            },
                        };
                    }),
                },
                server: {
                    connect: { id: server.id },
                },
            },
        });
        console.log(`Created hub with id: ${hub.id}`);
    }

    console.log(`Seeding database completed, starting seeding vpn.`);

    for (const h of hubs) {
        // do the same in vpn

        let data = new VPN.VpnRpcCreateHub({
            HubName_str: h.title,
            HubType_u32: VPN.VpnRpcHubType.Standalone,
            Online_bool: true,
            AdminPasswordPlainText_str: h.password,
            MaxSession_u32: 256,
            NoEnum_bool: false,
        });
        let vpnHub = await vpn.CreateHub(data);

        for (let index in h.users) {
            let huser = h.users[index];
            let data = new VPN.VpnRpcSetUser({
                HubName_str: h.title,
                Name_str: huser.vpnName,
                Realname_utf: huser.name,
                AuthType_u32: VPN.VpnRpcUserAuthType.Password,
                Auth_Password_str: h.password,
            });

            await vpn.CreateUser(data);
        }
    }

    console.log(`Seeding finished.`);
}

if (process.env.ENABLE_SEEDING.toLocaleLowerCase() == "true") {
    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
