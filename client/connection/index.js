import gql from "graphql-tag";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client/core";

const SERVER_PORT = 3000;

export default class Connection {
    _token;
    _user;
    _link;
    _apollo;

    constructor() {
        this._link = createHttpLink({
            uri: "http://localhost:" + SERVER_PORT + "/api",
        });
        this._apollo = new ApolloClient({
            link: this._link,
            cache: new InMemoryCache(),
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
    logout() {
        this._token = null;
        this._user = null;
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
