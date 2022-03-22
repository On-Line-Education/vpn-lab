const { PrismaClient } = require("@prisma/client"),
    { faker } = require("@faker-js/faker"),
    crypto = require("crypto");

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);
    // const userData: Prisma.UserCreateInput[];
    let seedCount = 50;
    let usersInHub = 15;

    let hubs = [];

    let names = [];

    for (let i = 0; i < seedCount; i++) {
        let password = faker.random.alphaNumeric(8);
        let title = faker.lorem.word();
        let passHash = crypto
            .createHash("SHA256")
            .update(password)
            .digest("hex");

        let users = [];

        for (let j = 0; j < usersInHub; j++) {
            let password = faker.random.alphaNumeric(8);
            let name = faker.name.firstName();
            while (names.includes(name)) {
                name = faker.random.alpha(8);
            }
            names.push(name);
            let passHash = crypto
                .createHash("SHA256")
                .update(password)
                .digest("hex");
            let fake = {
                name,
                passHash,
                role: 0,
            };
            console.dir("USER PASS: " + password);
            console.dir(fake);

            users.push(fake);
        }

        let fake = {
            title,
            passHash,
            users: {
                create: [...users],
            },
        };
        console.dir("HUB PASS: " + password);
        console.dir(fake);
        hubs.push(fake);
    }

    for (const h of hubs) {
        const hub = await prisma.hub.create({
            data: h,
        });
        console.log(`Created hub with id: ${hub.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
