// import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import ResolversBuilder from "./Resolvers/ResolversBuilder";
import schema from "./Schema/schema";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";

export default async function createServer(
    resolvers: ResolversBuilder,
    vpn: SoftEtherAPI
) {
    const app = express();
    // const httpServer = createServer(app);

    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers.build(vpn),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        path: "/api",
    });

    app.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(
            `Server listening on localhost:4000${apolloServer.graphqlPath}`
        )
    );
    // httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    //     console.log(
    //         `Server listening on localhost:4000${apolloServer.graphqlPath}`
    //     )
    // );
}
