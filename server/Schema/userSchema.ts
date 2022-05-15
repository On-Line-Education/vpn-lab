import { gql } from "apollo-server-express";

export default gql`
    input UserSettings {
        newPassword: String
        oldPassword: String!
    }

    type Token {
        token: String
    }

    type User {
        id: Int
        name: String
        role: String
    }

    type Query {
        loginViaKey(loginKey: String): Token
        loginViaPassword(username: String, password: String): Token
        getCurrentUser: User
        changeUserSettings(settings: UserSettings): Boolean
    }
`;
