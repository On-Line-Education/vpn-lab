<template>
    <div
        class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100"
        id="sidenav-collapse-main"
    >
        <ul class="navbar-nav">
            <li class="nav-item">
                <sidenav-collapse navText="HUBy" :to="{ name: 'HUBy' }">
                    <template v-slot:icon>
                        <i class="fas fa-solid fa-diagram-project" />
                    </template>
                </sidenav-collapse>
            </li>
            <li class="nav-item">
                <sidenav-collapse navText="FTP" :to="{ name: 'FTP' }">
                    <template v-slot:icon>
                        <i class="fas fa-solid fa-folder-tree" />
                    </template>
                </sidenav-collapse>
            </li>
            <li class="nav-item">
                <sidenav-collapse
                    navText="Administracja"
                    :to="{ name: 'Administracja' }"
                >
                    <template v-slot:icon>
                        <i class="fas fa-solid fa-screwdriver-wrench" />
                    </template>
                </sidenav-collapse>
            </li>
        </ul>
    </div>
    <div class="pt-3 mx-3 mt-3 sidenav-footer">
        <sidenav-card
            :class="cardBg"
            textPrimary="Hello from code!"
            textSecondary="It's here in case if I'd need to check"
            href="https://www.creative-tim.com/learning-lab/vue/overview/soft-ui-dashboard/"
            linkText="Documentation"
            iconClass="ni ni-diamond"
        />
        <a
            class="btn bg-gradient-warning mt-4 w-100"
            href="https://www.creative-tim.com/product/vue-soft-ui-dashboard-pro?ref=vsud"
            type="button"
            >Me have no $$ to "Upgrade to pro"</a
        >
    </div>
</template>
<script setup lang="ts">
import Icon from "../../../components/Basic/Icon.vue";
import SidenavCollapse from "./SidenavCollapse.vue";
import SidenavCard from "./SidenavCard.vue";
import { useRoute } from "vue-router";
const route = useRoute();

const { cardBg } = defineProps({
    cardBg: String,
});

var title = "OEDU VPN APP",
    controls = "dashboardsExamples",
    isActive: "active";

const getRoute = () => {
    const routeArr = route.path.split("/");
    return routeArr[1];
};
</script>
