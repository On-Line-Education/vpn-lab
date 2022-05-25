import { mergeTypeDefs } from "@graphql-tools/merge";
import hubSchema from "./hubSchema";
import accessListSchema from "./accessListSchema";
import veyonSchema from "./veyonSchema";
import userSchema from "./userSchema";
import systemSchema from "./systemSchema";
import groupSchema from "./groupSchema";

export default mergeTypeDefs([
    hubSchema,
    accessListSchema,
    veyonSchema,
    userSchema,
    systemSchema,
    groupSchema,
]);
