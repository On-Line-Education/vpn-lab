import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { createStore } from "vuex";

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
        loggedIn: false,
        lastError: null,
        //--
        apollo: new ApolloClient({
            uri: "http://localhost:4000/api",
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
            state.loggedIn = payload;
        },
        setError(state, error) {
            state.lastError = error;
        },
        setHubsList(state, hubsList) {
            state.hubsList = hubsList;
        },
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
        hubsList(state) {
            return state.hubsList;
        },
    },
});
