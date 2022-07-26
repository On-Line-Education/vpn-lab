import express from "express";
import { ApolloServer } from "apollo-server-express";
import ResolversBuilder from "./Resolvers/resolversBuilder";
import schema from "./Schema/schema";
import SoftEtherAPI from "./SoftEtherApi/SoftEtherAPI";
import cors from "cors";
import loginResolver from "./Helpsers/loginResolver";
import fs from "fs";
import https from "https";
import http from "http";
import { PrismaClient } from "@prisma/client";

export default async function createServer(
    resolvers: ResolversBuilder,
    vpn: SoftEtherAPI,
    db: PrismaClient
) {
    const app = express();

    const apolloServer = new ApolloServer({
        typeDefs: schema,
        resolvers: resolvers.build(vpn, db),
        context: async ({ req }) => {
            const token = req.headers.authorization || "";

            let context = await loginResolver(token);

            return { user: context.user, api: context.apiCall };
        },
        introspection: process.env.NODE_ENV !== "production",
    });

    await apolloServer.start();

    app.use(cors());

    apolloServer.applyMiddleware({
        app,
        path: "/api",
    });

    let httpServer: http.Server | https.Server;
    if (process.env.NODE_ENV == "production") {
        // Assumes certificates are in a .ssl folder off of the package root.
        // Make sure these files are secured.
        httpServer = https.createServer(
            {
                key: fs.readFileSync(`../ssl/server.key`),
                cert: fs.readFileSync(`../ssl/server.crt`),
            },

            app
        );
    } else {
        httpServer = http.createServer(app);
    }

    await httpServer.listen({ port: process.env.SERVER_PORT || 3000 }, () => {
        console.log(
            `Server listening on localhost:${process.env.SERVER_PORT || 3000}${
                apolloServer.graphqlPath
            }`
        );
    });
}

// https://www.apollographql.com/docs/apollo-server/security/terminating-ssl/
