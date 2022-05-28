import { gql } from "apollo-server-express";

export default gql`
    type VeyonKeys {
        pubKey: String
        privKey: String
    }

    type Query {
        getVeyonKeys(username: String): VeyonKeys
        changeUserGroupToTeacher(
            studentName: String
            teacherName: String
        ): Boolean
    }
`;
