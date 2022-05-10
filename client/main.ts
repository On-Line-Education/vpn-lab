import { createApp } from "vue";
// @ts-ignore
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import SoftUIDashboard from "./soft-ui-dashboard";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/css/style.css";

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(SoftUIDashboard);
appInstance.mount("#app");
