<template>
    <nav
        class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl"
        v-bind="$attrs"
        id="navbarBlur"
        data-scroll="true"
        ref="navbar"
    >
        <div class="px-3 py-1 container-fluid">
            <breadcrumbs
                :currentPage="currentRouteName"
                :textWhite="textWhite"
            />
            <div
                class="mt-2 mt-sm-0 me-md-0 me-sm-4 justify-content-end"
                id="navbar"
            >
                <ul class="navbar-nav justify-content-end flex-row">
                    <li class="nav-item d-flex align-items-center">
                        <div class="px-0 text-body">
                            <i class="fa-solid fa-user me-sm-1"></i>
                            <span>{{ user.name }}</span>
                        </div>
                    </li>
                    <li class="nav-item ps-3 d-flex align-items-center">
                        <router-link
                            :to="{ name: 'Wyloguj' }"
                            class="px-0 nav-link font-weight-bold"
                            :class="textWhite ? textWhite : 'text-body'"
                        >
                            <!-- <i class="fas fa-user me-sm-1"></i> -->
                            <i
                                class="fa-solid fa-arrow-right-from-bracket me-sm-1"
                            ></i>
                            <span class="d-sm-inline d-none">Wyloguj się </span>
                        </router-link>
                    </li>

                    <li
                        class="nav-item d-xl-none ps-3 d-flex align-items-center"
                    >
                        <a
                            href="#"
                            @click="toggleSidebar"
                            class="p-0 nav-link text-body"
                            id="iconNavbarSidenav"
                        >
                            <div class="sidenav-toggler-inner">
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                                <i class="sidenav-toggler-line"></i>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script setup>
import Breadcrumbs from "./Breadcrumbs.vue";
import { computed, onUpdated, ref } from "vue";
import { mapMutations, mapActions, useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const navbar = ref();

const props = defineProps({
    minNav: String,
    textWhite: String,
});
const { navbarMinimize, toggleConfigurator } = mapMutations([
    "navbarMinimize",
    "toggleConfigurator",
]);
const { toggleSidebarColor } = mapActions(["toggleSidebarColor"]);

const toggleSidebar = () => {
    store.commit("toggleSidebar");
    // navbarMinimize();
};
const currentRouteName = computed(() => {
    return route.name;
});
onUpdated(() => {
    window.addEventListener("scroll", () => {
        if (!navbar.classList) return;
        if (window.scrollY > 10 && store.state.isNavFixed) {
            navbar.classList.add("blur");
            navbar.classList.add("position-sticky");
            navbar.classList.add("shadow-blur");
        } else {
            navbar.classList.remove("blur");
            navbar.classList.remove("position-sticky");
            navbar.classList.remove("shadow-blur");
        }
    });
});
const user = store.getters.getServer.getUser();
</script>
