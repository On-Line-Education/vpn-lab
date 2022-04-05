import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// @ts-ignore
import Dashboard from "../views/Dashboard.vue";
// @ts-ignore
import Tables from "../views/Tables.vue";
// @ts-ignore
import Billing from "../views/Billing.vue";
// @ts-ignore
import VirtualReality from "../views/VirtualReality.vue";
// @ts-ignore
import Profile from "../views/Profile.vue";
// @ts-ignore
import Rtl from "../views/Rtl.vue";
// @ts-ignore
import SignIn from "../views/SignIn.vue";
// @ts-ignore
import SignUp from "../views/SignUp.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "/",
        redirect: "/dashboard",
    },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/tables",
        name: "Tables",
        component: Tables,
    },
    {
        path: "/billing",
        name: "Billing",
        component: Billing,
    },
    {
        path: "/virtual-reality",
        name: "Virtual Reality",
        component: VirtualReality,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },
    {
        path: "/rtl-page",
        name: "Rtl",
        component: Rtl,
    },
    {
        path: "/sign-in",
        name: "Sign In",
        component: SignIn,
    },
    {
        path: "/sign-up",
        name: "Sign Up",
        component: SignUp,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
