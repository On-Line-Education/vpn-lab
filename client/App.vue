<template>
    <div :class="[alertClasses]" style="z-index: 100" role="alert">
        <span class="alert-icon"><i :class="[alertIconClasses]"></i></span>
        <span class="alert-text error-alert-text"
            ><strong v-if="isErrorAlert"> Błąd! </strong
            ><strong v-else> Sukces! </strong>
            {{ store.getters.getLastMessage }}</span
        >
        <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="alertClose"
        >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
    <sidenav
        custom_class="card-background-mask-warning"
        :class="[store.state.isTransparent, 'fixed-start']"
        v-if="store.state.showSidenav"
    />
    <main
        class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
    >
        <!-- nav -->
        <navbar
            :class="[navClasses]"
            :textWhite="store.state.isAbsolute ? 'text-white opacity-8' : ''"
            :minNav="navbarMinimize + ''"
            v-if="store.state.showNavbar"
        />
        <router-view />
    </main>
</template>
<script setup>
import Sidenav from "./views/Layout/Sidenav/index.vue";
import Navbar from "./views/Layout/Navbar.vue";

import { computed, onBeforeMount, watch } from "vue";
import { mapMutations, useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
const store = useStore();
const route = useRoute();
const router = useRouter();
const mut = mapMutations(["toggleConfigurator", "navbarMinimize"]);
const currentRouteName = computed(() => {
    return route.name;
});

function checkPerms(route) {
    if (route !== "Zaloguj się" && !store.getters.isLoggedIn) {
        store.commit("logoutState");
        router.push({ name: "Zaloguj się" });
    } else if (route === "Zaloguj się") {
        store.commit("logoutState");
    }
}
checkPerms(currentRouteName);
watch(currentRouteName, (r) => checkPerms(r));

const navbarMinimize = mapMutations(["navbarMinimize"]);

const alertClasses = computed(() => {
    return {
        "pos-alert alert alert-danger alert-dismissible fade show":
            store.state.isAlertError && store.state.showAlert,
        "pos-alert alert alert-success alert-dismissible fade show":
            !store.state.isAlertError && store.state.showAlert,
        "pos-alert alert alert-danger alert-dismissible fade":
            !store.state.showAlert,
    };
});
const alertIconClasses = computed(() => {
    return {
        "fa-solid fa-circle-exclamation": store.state.isAlertError,
        "ni ni-like-2": !store.state.isAlertError,
    };
});

const navClasses = computed(() => {
    return {
        "position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky":
            store.state.isNavFixed,
        "position-absolute px-4 mx-0 w-100 z-index-2": store.state.isAbsolute,
        "px-0 mx-4 mt-4": !store.state.isAbsolute,
    };
});

const isErrorAlert = computed(() => {
    return store.state.isAlertError;
});

onBeforeMount(() => {
    store.state.isTransparent = "bg-transparent";
});

function alertClose() {
    store.commit("hideAlert");
}

document.title = store.getters.appName;
</script>
