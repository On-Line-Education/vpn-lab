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
            uri: require('../config').ENV.API_URL,
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

    async loginViaKey(key) {
        const res = await this._apollo.query({
            query: gql`
                query LoginViaKey($loginKey: String) {
                    loginViaKey(loginKey: $loginKey) {
                        token
                    }
                }
            `,
            variables: {
                loginKey: key,
            },
        });
        this._token = res.data.loginViaKey.token;
        await this._setUser();
        return res;
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
        this._token = res.data.loginViaKey.token;
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
                        group
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
    async addUserToGroup(hubName, group, userName) {
        return await this._apollo.query({
            query: gql`
                query CreateGroup(
                    $userName: String
                    $group: String
                    $hubName: String
                ) {
                    addUserToGroup(
                        userName: $userName
                        group: $group
                        hubName: $hubName
                    )
                }
            `,
            variables: { hubName, group, userName },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async changeUserSettings({ newPassword, oldPassword }) {
        return await this._apollo.query({
            query: gql`
                query Query($settings: UserSettings) {
                    changeUserSettings(settings: $settings)
                }
            `,
            variables: {
                settings: {
                    newPassword,
                    oldPassword,
                },
            },
            context: {
                headers: {
                    authorization: this._token,
                },
            },
        });
    }
    async removeFromSystemGroup(hubName, username, group) {
        return await this._apollo.query({
            query: gql`
                query Query(
                    $hubName: String
                    $username: String
                    $group: String
                ) {
                    removeFromSystemGroup(
                        hubName: $hubName
                        username: $username
                        group: $group
                    )
                }
            `,
            variables: {
                hubName,
                username,
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
        return await this._apollo.query({
            query: gql`
                query Query($data: Import) {
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
            let user = await this._apollo.query({
                query: gql`
                    query GetCurrentUser {
                        getCurrentUser {
                            id
                            name
                            role
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
    }
    getUser() {
        return this._user;
    }
}
