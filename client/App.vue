<template>
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

import { computed, onBeforeMount } from "vue";
import { mapMutations, useStore } from "vuex";
const store = useStore();
const mut = mapMutations(["toggleConfigurator", "navbarMinimize"]);

const navbarMinimize = mapMutations(["navbarMinimize"]);

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
</script>
