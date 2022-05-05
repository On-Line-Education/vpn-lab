// import { createServer } from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import ResolversBuilder from "./Resolvers/ResolversBuilder";
import schema from "./Schema/schema";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";
import cors from "cors";

export default async function createServer(
    resolvers: ResolversBuilder,
    vpn: SoftEtherAPI
) {
    const app = express();
    // const httpServer = createServer(app);

    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers.build(vpn),
        context: ({ req }) => {
            // get the user token from the headers
            const token = req.headers.authorization || "";

            // try to retrieve a user with the token
            // const user = getUser(token);

            // optionally block the user
            // we could also check user roles/permissions here
            // if (!user) throw new AuthenticationError('you must be logged in');

            // add the user to the context
            // return { user };

            return null;
        },
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({
        app,
        path: "/api",
    });

    app.use(cors());
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

// https://www.apollographql.com/docs/apollo-server/security/terminating-ssl/
