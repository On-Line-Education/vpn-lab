import { createStore } from "vuex";
import Connection from "../connection";

export default createStore({
    state: () => ({
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
        showErrorAlert: false,
        lastError: null,

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
        navbarFixed(state) {
            if (state.isNavFixed === false) {
                state.isNavFixed = true;
            } else {
                state.isNavFixed = false;
            }
        },
        setError(state, error) {
            state.lastError = error;
            state.showErrorAlert = true;
        },
        hideAlert(state) {
            state.showErrorAlert = false;
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
                    state.lastError = e;
                    state.showErrorAlert = true;
                });
        },
        loginViaPassword({ commit, state }, payload) {
            state.server
                .loginViaPassword(payload)
                .then((res) => {
                    state.loggedIn = true;
                    state.server.getUser();
                    commit("loginState");
                })
                .catch((e) => {
                    state.lastError = e;
                    state.showErrorAlert = true;
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
        getLastError(state) {
            return state.lastError;
        },
        getLastErrorMessage(state) {
            return state.lastError?.message ?? "";
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
    },
});
