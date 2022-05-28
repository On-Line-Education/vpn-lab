import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getVeyonKeys(_: any, { username }: any, { api }) {
                if (!api) {
                    throw new AuthenticationError("Not authorized");
                }
                let u = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });
                return {
                    pubKey: u.veyonKeyPub,
                    privKey: u.veyonKeyPriv,
                };
            },
            async changeUserGroupToTeacher(
                _: any,
                { studentName, teacherName }: any,
                { api }
            ) {
                if (!api) {
                    throw new AuthenticationError("Not authorized");
                }
                let teacher = await prisma.hub.findFirst({
                    where: {
                        users: {
                            some: {
                                user: {
                                    name: teacherName,
                                },
                            },
                        },
                    },
                    select: {
                        title: true,
                    },
                });

                let teacherVpn = await vpn.user.getUser(
                    teacher.title,
                    teacherName
                );

                await vpn.user.setGroup(
                    teacher.title,
                    studentName,
                    teacherVpn.GroupName_str
                );

                return true;
            },
        },
    };
};
