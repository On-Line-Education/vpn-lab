import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// @ts-ignore
import SignIn from "../views/SignIn.vue";
// @ts-ignore
import Hubs from "../views/Hubs.vue";
// @ts-ignore
import Ftp from "../views/Ftp.vue";
// @ts-ignore
import Administration from "../views/Administration.vue";
// @ts-ignore
import Logout from "../views/Logout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/sign-in",
        name: "Zaloguj się",
        component: SignIn,
    },
    {
        path: "/hubs",
        name: "HUBy",
        component: Hubs,
    },
    {
        path: "/administration",
        name: "Administracja",
        component: Administration,
    },
    {
        path: "/ftp",
        name: "FTP",
        component: Ftp,
    },
    {
        path: "/logout",
        name: "Wyloguj",
        component: Logout,
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: {
            name: "Zaloguj się",
        },
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    linkActiveClass: "active",
});

export default router;
