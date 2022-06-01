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
        hubs: [String]
    }

    type ApiUser {
        id: Int
        name: String
        role: String
        veyonKeyPriv: String
        veyonKeyPub: String
        groupName: String
    }

    type UserVPNLogin {
        vpnLogin: String
        vpnPass: String
    }

    type TeachersWithUserVPNData {
        teachers: [ApiUser]
        user: UserVPNLogin
    }

    type LoginKeyOutput {
        token: String
        user: User
    }

    type Query {
        loginViaKey(loginKey: String): LoginKeyOutput
        loginViaPassword(username: String, password: String): Token
        getCurrentUser: User
        changeUserSettings(settings: UserSettings): Boolean
        getAllUsersInStudentsGroup(username: String, group: String): [ApiUser]
        getTeachersInUserGroups(username: String): TeachersWithUserVPNData
    }
`;
