import { gql } from "apollo-server-express";

export default gql`
    type Token {
        token: String
    }

    type Query {
        loginViaKey(loginKey: String): Token
        loginViaPassword(username: String, password: String): Token
    }
`;
