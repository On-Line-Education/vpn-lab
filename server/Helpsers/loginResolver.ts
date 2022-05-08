import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default async function (token: string) {
    if (token === process.env.DESKTOP_KEY) {
        return { user: null, apiCall: true };
    }

    let userToken = await prisma.token.findFirst({
        where: {
            token,
        },
    });
    if (!userToken) return { user: null, apiCall: false };
    let user = await prisma.user.findFirst({
        where: {
            id: userToken.userId,
        },
    });
    return { user, apiCall: false };
}
