import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";
import ResolversAccessList from "./ResolversAccessList";
import ResolversHub from "./ResolversHub";
import { deepmerge } from "deepmerge-ts";
import { PrismaClient } from "@prisma/client";
import ResolversVeyon from "./ResolversVeyon";
import ResolversUser from "./ResolversUser";

export default class ResolversBuilder {
    public build(vpn: SoftEtherAPI): any {
        let resolver = {},
            prisma = new PrismaClient();
        let res = [
            ResolversHub(vpn),
            ResolversAccessList(vpn),
            ResolversVeyon(prisma),
            ResolversUser(prisma),
        ];

        res.forEach((r) => {
            resolver = deepmerge(resolver, r);
        });

        return resolver;
    }
}
