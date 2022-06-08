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

    enum Permission {
        ADMIN
        INSTRUCTOR
        USER
    }

    type Query {
        loginViaKey(loginKey: String): LoginKeyOutput
        loginViaPassword(username: String, password: String): Token
        getCurrentUser: User
        getAllUsersInStudentsGroup(username: String, group: String): [ApiUser]
        getTeachersInUserGroups(username: String): TeachersWithUserVPNData
    }

    type Mutation {
        changeUserSettings(settings: UserSettings): Boolean
        createUser(hubname: String, username: String, password: String, passcode: String, role: Permission): Boolean
        deleteUser(hubname: String, username: String): Boolean
    }
`;
