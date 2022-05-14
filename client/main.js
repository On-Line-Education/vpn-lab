import { createApp, provide, h } from "vue";
// @ts-ignore
import App from "./App.vue";
import store from "./store";
import router from "./router/index.js";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import SoftUIDashboard from "./soft-ui-dashboard";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/style.css";
import { DefaultApolloClient } from "@vue/apollo-composable";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
} from "@apollo/client/core";

const SERVER_PORT = 3000;

const link = createHttpLink({
    uri: "http://localhost:" + SERVER_PORT + "/api",
});
const apollo = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

const appInstance = createApp({
    setup() {
        provide(DefaultApolloClient, apollo);
    },

    render: () => h(App),
});
appInstance.use(store);
appInstance.use(router);
appInstance.use(SoftUIDashboard);
appInstance.mount("#app");
