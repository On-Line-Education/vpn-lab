import { createStore } from "vuex";
import Connection from "../connection";

export default createStore({
    state: () => ({
        appName: "OEDU VPN",
        username: "",
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
        showErrorAlert: false,
        showAlert: false,
        isAlertError: false,

        lastMessage: null,

        server: new Connection(),
        hubsList: [],
    }),
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
        toggleSidebar(state) {
            state.showSidenav = !state.showSidenav;
        },
        navbarFixed(state) {
            if (state.isNavFixed === false) {
                state.isNavFixed = true;
            } else {
                state.isNavFixed = false;
            }
        },
        setError(state, error) {
            state.lastMessage = error;
            state.isAlertError = true;
            state.showAlert = true;
        },
        showAlert(state, message) {
            state.lastMessage = message;
            state.isAlertError = false;
            state.showAlert = true;
        },
        hideAlert(state) {
            state.showAlert = false;
        },
        loginState(state) {
            state.hideConfigButton = false;
            state.showNavbar = true;
            state.showSidenav = true;
            state.showFooter = true;
        },
        logoutState(state) {
            state.hideConfigButton = true;
            state.showNavbar = false;
            state.showSidenav = false;
            state.showFooter = false;
        },
        setHubsList(state, hubsList) {
            state.hubsList = hubsList;
        },
        setUsername(state, name) {
            state.username = name;
        },
    },
    actions: {
        toggleSidebarColor({ commit }, payload) {
            commit("sidebarType", payload);
        },
        loginViaKey({ commit, state }, key) {
            state.server
                .loginViaKey(key)
                .then((res) => {
                    state.loggedIn = true;
                    commit("loginState");
                })
                .catch((e) => {
                    commit("setError", e);
                });
        },
        loginViaPassword({ commit, state }, payload) {
            state.server
                .loginViaPassword(payload)
                .then((res) => {
                    state.loggedIn = true;
                    commit("loginState");
                })
                .catch((e) => {
                    commit("setError", e);
                });
        },
        logout({ state, commit }) {
            state.server.logout();
            state.loggedIn = false;
            commit("setHubsList", []);
            commit("logoutState");
        },
        listHubs({ state, commit }) {
            state.server
                .listHubs()
                .then((hubs) => {
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
        getUsername(state) {
            return state.username;
        },
        getError(state) {
            return state.lastMessage;
        },
        getLastMessage(state) {
            return state.lastMessage?.message ?? "";
        },
        hubsList(state) {
            return state.hubsList;
        },
        isLoggedIn(state) {
            return state.loggedIn;
        },
        getRole(state) {
            return state.server.getUser()?.role ?? "";
        },
        getHubsNames(state) {
            let names = [];
            state.hubsList.forEach((hub) => {
                names.push(hub.HubName_str);
            });
            return names;
        },
        getServer(state) {
            return state.server;
        },
    },
});
