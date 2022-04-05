import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// @ts-ignore
import SignIn from "../views/SignIn.vue";
// @ts-ignore
import Dashboard from "../views/Dashboard.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/sign-in",
        name: "Sign In",
        component: SignIn,
    },
    {
        path: "/",
        name: "Dashboard",
        component: Dashboard,
    },
    {
        path: "/",
        name: "TODO",
        component: Dashboard,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
