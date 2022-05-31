import { PrismaClient } from "@prisma/client";
import { AuthenticationError } from "apollo-server-express";
import Roles from "../Helpsers/roles";
import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default (prisma: PrismaClient, vpn: SoftEtherAPI) => {
    return {
        Query: {
            async getVeyonKeys(_: any, { hubName, username }: any, { api }) {
                if (!api) {
                    throw new AuthenticationError("Not authorized");
                }
                let u = await prisma.user.findFirst({
                    where: {
                        name: username,
                    },
                });

                let s = await vpn.hub.getSecureNATOption(hubName);

                console.log(s);

                return {
                    pubKey: u.veyonKeyPub,
                    privKey: u.veyonKeyPriv,
                    secureNATOption: s,
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