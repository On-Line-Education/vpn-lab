import { gql } from "apollo-server-express";
import { mergeTypeDefs } from "@graphql-tools/merge";
import hubSchema from "./hubSchema";
import accessListSchema from "./accessListSchema";

export default mergeTypeDefs([hubSchema, accessListSchema]);
