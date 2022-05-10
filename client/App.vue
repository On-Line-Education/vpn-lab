<template>
    <div :class="[alertClasses]" style="z-index: 100" role="alert">
        <span class="alert-icon"
            ><i class="fa-solid fa-circle-exclamation"></i
        ></span>
        <span class="alert-text error-alert-text"
            ><strong> Uwaga! </strong>
            {{ store.getters.getLastErrorMessage }}</span
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
<script setup lang="ts">
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

watch(currentRouteName, (r) => {
    if (r !== "Zaloguj się" && !store.state.token) {
        router.push({ name: "Zaloguj się" });
    }
});
const navbarMinimize = mapMutations(["navbarMinimize"]);

const alertClasses = computed(() => {
    return {
        "pos-alert alert alert-danger alert-dismissible fade show":
            store.state.showErrorAlert,
        "pos-alert alert alert-danger alert-dismissible fade":
            !store.state.showErrorAlert,
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
onBeforeMount(() => {
    store.state.isTransparent = "bg-transparent";
});

function alertClose() {
    store.commit("hideAlert");
}
</script>
