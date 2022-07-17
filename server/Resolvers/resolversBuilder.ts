import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";
import ResolversAccessList from "./resolversAccessList";
import ResolversHub from "./resolversHub";
import { deepmerge } from "deepmerge-ts";
import { PrismaClient } from "@prisma/client";
import ResolversVeyon from "./resolversVeyon";
import ResolversUser from "./resolversUser";
import ResolversSystem from "./resolversSystem";
import resolversGroup from "./resolversGroup";

export default class ResolversBuilder {
    public build(vpn: SoftEtherAPI, db: PrismaClient): any {
        let resolver = {};
        let res = [
            ResolversHub(db, vpn),
            ResolversAccessList(vpn),
            ResolversVeyon(db, vpn),
            ResolversUser(db, vpn),
            ResolversSystem(db, vpn),
            resolversGroup(db, vpn),
        ];

        res.forEach((r) => {
            resolver = deepmerge(resolver, r);
        });

        return resolver;
    }
}
