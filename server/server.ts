import express from "express";
import { ApolloServer } from "apollo-server-express";
import ResolversBuilder from "./Resolvers/resolversBuilder";
import schema from "./Schema/schema";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";
import cors from "cors";
import loginResolver from "./Helpsers/loginResolver";

export default async function createServer(
    resolvers: ResolversBuilder,
    vpn: SoftEtherAPI
) {
    const app = express();

    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers.build(vpn),
        context: async ({ req }) => {
            const token = req.headers.authorization || "";

            let context = await loginResolver(token);

            return { user: context.user, api: context.apiCall };
        },
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        path: "/api",
    });

    app.use(cors());
    app.listen({ port: process.env.SERVER_PORT || 3000 }, () =>
        console.log(
            `Server listening on localhost:${process.env.SERVER_PORT || 3000}${
                apolloServer.graphqlPath
            }`
        )
    );
}

// https://www.apollographql.com/docs/apollo-server/security/terminating-ssl/
