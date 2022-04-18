import SoftEtherAPI from "../SoftEtherApi/SoftEtherAPI";

export default class ResolversBuilder {
    public build(vpn: SoftEtherAPI): any {
        return {
            Query: {
                hello: () => "Hello world!",
                async getVPNHub(_: any, { name }: any) {
                    console.log({ name, vpn });
                    let v = await vpn.hub.get(name);
                    console.log({ v });
                    return v;
                },
            },
        };
    }
}
