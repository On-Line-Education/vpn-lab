import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import Roles from "../Helpsers/roles";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            // username must be vpn name
            async getVeyonKeys(_: any, { hubName, username }: any, { api }) {
                if (!api) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }
                let u = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });

                let s = await vpn.hub.getSecureNATOption(hubName);

                return {
                    pubKey: u.veyonKeyPub,
                    privKey: u.veyonKeyPriv,
                    secureNATOption: s,
                };
            },
        },
        Mutation: {
            // studentName and teacherName must be vpn name
            async changeUserGroupToTeacher(
                _: any,
                { studentName, teacherName }: any,
                { api }
            ) {
                if (!api) {
                    throw new AuthenticationError("Nie masz uprawnień");
                }

                if (
                    (
                        await prisma.user.findFirst({
                            where: {
                                name: studentName,
                            },
                        })
                    ).role === Roles.INSTRUCTOR
                ) {
                    return false;
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
