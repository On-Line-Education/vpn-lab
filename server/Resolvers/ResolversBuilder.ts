import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";
import ResolversAccessList from "./resolversAccessList";
import ResolversHub from "./resolversHub";
import { deepmerge } from "deepmerge-ts";
import { PrismaClient } from "@prisma/client";
import ResolversVeyon from "./resolversVeyon";
import ResolversUser from "./resolversUser";
import ResolversSystem from "./resolversSystem";

export default class ResolversBuilder {
    public build(vpn: SoftEtherAPI): any {
        let resolver = {},
            prisma = new PrismaClient();
        let res = [
            ResolversHub(prisma, vpn),
            ResolversAccessList(vpn),
            ResolversVeyon(prisma, vpn),
            ResolversUser(prisma),
            ResolversSystem(prisma, vpn),
        ];

        res.forEach((r) => {
            resolver = deepmerge(resolver, r);
        });

        return resolver;
    }
}
