<template>
    <aside
        class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl"
        :class="'ms-3'"
        id="sidenav-main"
        data-color="warning"
    >
        <div class="sidenav-header">
            <i
                class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
                aria-hidden="true"
                id="iconSidenav"
            ></i>
            <a class="m-0 navbar-brand" href="/">
                <i class="fas fa-duotone fa-network-wired" alt="main_logo" />
                <span class="ms-1 font-weight-bold">{{
                    store.getters.appName
                }}</span>
            </a>
        </div>
        <hr class="mt-0 horizontal dark" />
        <sidenav-list :cardBg="custom_class" />
    </aside>
</template>
<script setup>
import SidenavList from "./SidenavList.vue";
import { useStore } from "vuex";
const store = useStore();
const { custom_class } = defineProps({
    custom_class: String,
});
</script>
