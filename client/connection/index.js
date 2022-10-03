import gql from "graphql-tag";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client/core";

export default class Connection {
    _token;
    _user;
    _link;
    _apollo;

    constructor() {
        this._link = createHttpLink({
            uri: require("../config").ENV.API_URL,
        });
        this._apollo = new ApolloClient({
            link: this._link,
            cache: new InMemoryCache(),
            defaultOptions: {
                query: {
                    fetchPolicy: "no-cache",
                },
            },
        });
    }
    async loginViaPassword(payload) {
        const res = await this._apollo.query({
            query: gql`
                query LoginViaPassword($username: String, $password: String) {
                    loginViaPassword(username: $username, password: $password) {
                        token
                    }
                }
            `,
            variables: {
                username: payload.username,
                password: payload.password,
            },
        });
        this._token = res.data.loginViaPassword.token;
        await this._setUser();
        return res;
    }
    async listHubs() {
        return await this._apollo.query({
            query: gql`
                query ListHubs {
                    listHubs {
                        NumHub_u32
                        HubList {
                            HubName_str
                            Online_bool
                            HubType_u32
                            NumUsers_u32
                            NumGroups_u32
                            NumSessions_u32
                            NumMacTables_u32
                            NumIpTables_u32
                            LastCommTime_dt
                            LastLoginTime_dt
                            CreatedTime_dt
                            NumLogin_u32
                            IsTrafficFilled_bool
                            Recv_BroadcastBytes_u64
                            Recv_BroadcastCount_u64
                            Recv_UnicastBytes_u64
                            Recv_UnicastCount_u64
                            Send_BroadcastBytes_u64
                            Send_BroadcastCount_u64
                            Send_UnicastBytes_u64
                            Send_UnicastCount_u64
                        }
                    }
                }
            `,
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async getHub(hubName) {
        return await this._apollo.query({
            query: gql`
                query GetHub($hubName: String) {
                    getHub(hubName: $hubName) {
                        AdminPasswordPlainText_str
                        HashedPassword_bin
                        HubName_str
                        HubType_u32
                        MaxSession_u32
                        NoEnum_bool
                        Online_bool
                        SecurePassword_bin
                    }
                }
            `,
            variables: {
                hubName,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async listHubsNames() {
        return await this._apollo.query({
            query: gql`
                query ListHubs {
                    listHubs {
                        HubList {
                            HubName_str
                        }
                    }
                }
            `,
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async listHubUsers(hubName) {
        return await this._apollo.query({
            query: gql`
                query Query($hubName: String) {
                    getHubUsers(hubName: $hubName) {
                        user {
                            AuthType_u32
                            DenyAccess_bool
                            Recv_BroadcastBytes_u64
                            Recv_BroadcastCount_u64
                            Recv_UnicastBytes_u64
                            Recv_UnicastCount_u64
                            Send_BroadcastBytes_u64
                            Send_BroadcastCount_u64
                            Send_UnicastBytes_u64
                            Send_UnicastCount_u64
                            Expires_dt
                            GroupName_str
                            IsExpiresFilled_bool
                            IsTrafficFilled_bool
                            LastLoginTime_dt
                            Name_str
                            Note_utf
                            NumLogin_u32
                            Realname_utf
                        }
                        groups
                        role
                        username
                    }
                }
            `,
            variables: {
                hubName,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async listGroupsInHub(hubName) {
        return await this._apollo.query({
            query: gql`
                query ListGroups($hubName: String) {
                    listGroups(hubName: $hubName) {
                        Name_str
                    }
                }
            `,
            variables: {
                hubName,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async listSystemGroupsInHub(hubName) {
        return await this._apollo.query({
            query: gql`
                query Query($hubName: String) {
                    listSystemGroups(hubName: $hubName)
                }
            `,
            variables: {
                hubName,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async addUserToGroup(hubName, group, vpnName) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation CreateGroup(
                    $hubName: String
                    $group: String
                    $vpnName: String
                ) {
                    addUserToGroup(
                        hubName: $hubName
                        group: $group
                        vpnName: $vpnName
                    )
                }
            `,
            variables: { hubName, group, vpnName },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async changeUserSettings({ newPassword, oldPassword, username }) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation ChangeUserSettings($settings: UserSettings) {
                    changeUserSettings(settings: $settings)
                }
            `,
            variables: {
                settings: {
                    newPassword,
                    oldPassword,
                    username,
                },
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async removeFromSystemGroup(hubName, vpnName, group) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation RemoveFromSystemGroup(
                    $hubName: String
                    $vpnName: String
                    $group: String
                ) {
                    removeFromSystemGroup(
                        hubName: $hubName
                        vpnName: $vpnName
                        group: $group
                    )
                }
            `,
            variables: {
                hubName,
                vpnName,
                group,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }

    logout() {
        this._token = null;
        this._user = null;
    }
    async import(importObj) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation Import($data: Import) {
                    import(data: $data)
                }
            `,
            variables: {
                data: importObj,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async _setUser() {
        if (!this._user) {
            await this.refreshUser();
        }
    }
    async refreshUser() {
        let user = await this._apollo.query({
            query: gql`
                query GetCurrentUser {
                    getCurrentUser {
                        id
                        name
                        role
                        username
                    }
                }
            `,
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
        this._user = user.data.getCurrentUser;
    }
    getUser() {
        return this._user;
    }
    async getIPsec() {
        return await this._apollo.query({
            query: gql`
                query GetIpSec {
                    getIpSec {
                        L2TP_Raw_bool
                        L2TP_IPsec_bool
                        EtherIP_IPsec_bool
                        IPsec_Secret_str
                        L2TP_DefaultHub_str
                    }
                }
            `,
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async setIPsec(
        L2TP_Raw,
        L2TP_IPsec,
        EtherIP_IPsec,
        IPsec_Secret,
        L2TP_DefaultHub
    ) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation SetIpSec($ipsec: IPSec) {
                    setIpSec(ipsec: $ipsec) {
                        L2TP_Raw_bool
                        L2TP_IPsec_bool
                        EtherIP_IPsec_bool
                        IPsec_Secret_str
                        L2TP_DefaultHub_str
                    }
                }
            `,
            variables: {
                ipsec: {
                    L2TP_Raw_bool: L2TP_Raw,
                    L2TP_IPsec_bool: L2TP_IPsec,
                    EtherIP_IPsec_bool: EtherIP_IPsec,
                    IPsec_Secret_str: IPsec_Secret,
                    L2TP_DefaultHub_str: L2TP_DefaultHub,
                },
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async getRoles() {
        return await this._apollo.query({
            query: gql`
                query Roles {
                    getRoles
                }
            `,
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async getFiles() {
        return await this._apollo.query({
            query: gql`
                query GetFilesList {
                    getFilesList {
                        id
                        name
                        url
                        permission
                    }
                }
            `,
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async addFile(name, url, permission) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation AddFileEntry(
                    $name: String
                    $permission: Permission
                    $url: String
                ) {
                    addFileEntry(
                        name: $name
                        permission: $permission
                        url: $url
                    )
                }
            `,
            variables: {
                name,
                permission,
                url,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async editFile(name, url, permission, id) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation EditFileEntry($data: FileEdit) {
                    editFileEntry(data: $data)
                }
            `,
            variables: {
                data: {
                    id,
                    name,
                    url,
                    permission,
                },
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async deleteFile(id) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation DeleteFileEntry($deleteFileEntryId: Int) {
                    deleteFileEntry(id: $deleteFileEntryId)
                }
            `,
            variables: {
                deleteFileEntryId: id,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async createNewHub(hubName, instructorUsername, instructorPassword) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation CreateNewHub(
                    $hubName: String
                    $instructorUsername: String
                    $instructorPassword: String
                ) {
                    createNewHub(
                        hubName: $hubName
                        instructorUsername: $instructorUsername
                        instructorPassword: $instructorPassword
                    )
                }
            `,
            variables: {
                hubName,
                instructorUsername,
                instructorPassword,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async createUser(hubname, username, password, role) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation CreateUser(
                    $hubname: String
                    $username: String
                    $password: String
                    $role: Permission
                ) {
                    createUser(
                        hubname: $hubname
                        username: $username
                        password: $password
                        role: $role
                    )
                }
            `,
            variables: {
                hubname,
                username,
                password,
                role,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async updateUser(vpnname, username, password, role) {
        let updated = await this._apollo.mutate({
            mutation: gql`
                mutation UpdateUser(
                    $vpnname: String
                    $username: String
                    $password: String
                    $role: Permission
                ) {
                    updateUser(
                        vpnname: $vpnname
                        username: $username
                        password: $password
                        role: $role
                    )
                }
            `,
            variables: {
                vpnname,
                username,
                password,
                role,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
        await this.refreshUser();
        return updated;
    }
    async deleteUser(hubname, vpnname) {
        return await this._apollo.mutate({
            mutation: gql`
                mutation DeleteUser($hubname: String, $vpnname: String) {
                    deleteUser(hubname: $hubname, vpnname: $vpnname)
                }
            `,
            variables: {
                hubname,
                vpnname,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async listUserHubs(username) {
        return await this._apollo.query({
            query: gql`
                query ListUserHubs($username: String) {
                    listUserHubs(username: $username) {
                        NumHub_u32
                        HubList {
                            HubName_str
                            Online_bool
                            HubType_u32
                            NumUsers_u32
                            NumGroups_u32
                            NumSessions_u32
                            NumMacTables_u32
                            NumIpTables_u32
                            LastCommTime_dt
                            LastLoginTime_dt
                            CreatedTime_dt
                            NumLogin_u32
                            IsTrafficFilled_bool
                            Recv_BroadcastBytes_u64
                            Recv_BroadcastCount_u64
                            Recv_UnicastBytes_u64
                            Recv_UnicastCount_u64
                            Send_BroadcastBytes_u64
                            Send_BroadcastCount_u64
                            Send_UnicastBytes_u64
                            Send_UnicastCount_u64
                        }
                    }
                }
            `,
            variables: {
                username,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async deleteHub(hubName) {
        return await this._apollo.query({
            query: gql`
                mutation DeleteHub($hubName: String) {
                    deleteHub(hubName: $hubName) {
                        HubName_str
                    }
                }
            `,
            variables: {
                hubName,
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
}
