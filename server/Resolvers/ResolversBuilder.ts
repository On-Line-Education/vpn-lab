import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";
import ResolversAccessList from "./ResolversAccessList";
import ResolversHub from "./ResolversHub";
import { deepmerge } from "deepmerge-ts";

export default class ResolversBuilder {
    public build(vpn: SoftEtherAPI): any {
        let resolver = {};

        let res = [ResolversHub(vpn), ResolversAccessList(vpn)];

        res.forEach((r) => {
            resolver = deepmerge(resolver, r);
        });

        console.log(resolver);

        return resolver;
    }
}
