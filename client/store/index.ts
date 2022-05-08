import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { createStore } from "vuex";

const SERVER_PORT = 3000;

export default createStore({
    state: {
        appName: "OEDU VPN",
        hideConfigButton: false,
        isPinned: true,
        showConfig: false,
        isTransparent: "",
        isRTL: false,
        mcolor: "",
        isNavFixed: false,
        isAbsolute: false,
        showNavs: true,
        showSidenav: true,
        showNavbar: true,
        showFooter: true,
        showMain: true,
        token: "",
        lastError: null,
        //--
        apollo: new ApolloClient({
            uri: "http://localhost:" + SERVER_PORT + "/api",
            cache: new InMemoryCache(),
        }),
        hubsList: [],
    },
    mutations: {
        toggleConfigurator(state) {
            state.showConfig = !state.showConfig;
        },
        navbarMinimize(state) {
            const sidenav_show = document.querySelector(".g-sidenav-show");
            const sidenav = document.getElementById("sidenav-main");

            if (sidenav_show.classList.contains("g-sidenav-pinned")) {
                sidenav_show.classList.remove("g-sidenav-pinned");
                setTimeout(function () {
                    sidenav.classList.remove("bg-white");
                }, 100);
                sidenav.classList.remove("bg-transparent");
                state.isPinned = true;
            } else {
                sidenav_show.classList.add("g-sidenav-pinned");
                sidenav.classList.add("bg-white");
                sidenav.classList.remove("bg-transparent");
                state.isPinned = false;
            }
        },
        sidebarType(state, payload) {
            state.isTransparent = payload;
        },
        navbarFixed(state) {
            if (state.isNavFixed === false) {
                state.isNavFixed = true;
            } else {
                state.isNavFixed = false;
            }
        },
        toggleLoggedIn(state, payload) {
            state.token = payload;
        },
        setError(state, error) {
            state.lastError = error;
        },
        setHubsList(state, hubsList) {
            state.hubsList = hubsList;
        },
        loginViaKey(state, key) {
            console.log({ key });
            state.apollo
                .query({
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
                })
                .then((res) => {
                    console.log(res);
                    state.token = res.data.loginViaKey.token;
                })
                .catch((e) => {
                    state.lastError = e;
                });
        },
        loginViaPassword(state, payload) {
            state.apollo
                .query({
                    query: gql`
                        query LoginViaPassword(
                            $username: String
                            $password: String
                        ) {
                            loginViaPassword(
                                username: $username
                                password: $password
                            ) {
                                token
                            }
                        }
                    `,
                    variables: {
                        username: payload.username,
                        password: payload.password,
                    },
                })
                .then((res) => {
                    console.log(res);
                    state.token = res.data.token;
                })
                .catch((e) => {
                    console.error(e);
                });
        },
        logout(state) {
            state.token = "";
        }
    },
    actions: {
        toggleSidebarColor({ commit }, payload) {
            commit("sidebarType", payload);
        },
        listHubs({ commit, state }) {
            state.apollo
                .query({
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
                })
                .then((hubs) => {
                    console.log(hubs);
                    commit("setHubsList", hubs.data.listHubs.HubList);
                })
                .catch((err) => {
                    commit("setError", err);
                });
        },
    },
    getters: {
        appName(state) {
            return state.appName;
        },
        getLastError(state) {
            return state.lastError;
        },
        hubsList(state) {
            return state.hubsList;
        },
    },
});
