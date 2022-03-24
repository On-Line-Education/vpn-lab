export default class ResolversBuilder {
    public build(): any {
        return {
            Query: {
                hello: () => "Hello world!",
            },
        };
    }
}
