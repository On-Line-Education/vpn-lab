import { gql } from "apollo-server-express";

export default gql`
    input UserSettings {
        newPassword: String
        oldPassword: String!
        username: String
    }

    type User {
        id: Int
        name: String
        role: String
        username: String
        hubs: [String]
    }

    type ApiUser {
        id: Int
        name: String
        username: String
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
        loginViaPassword(username: String, password: String): LoginKeyOutput
        getCurrentUser: User
        getAllUsersInStudentsGroup(vpnname: String, group: String): [ApiUser]
        getTeachersInUserGroups(vpnname: String): TeachersWithUserVPNData
    }

    type Mutation {
        changeUserSettings(settings: UserSettings): Boolean
        createUser(
            hubname: String
            name: String
            username: String
            password: String
            role: Permission
        ): Boolean
        updateUser(
            vpnname: String
            username: String
            password: String
            role: Permission
        ): Boolean
        deleteUser(hubname: String, username: String): Boolean
    }
`;
