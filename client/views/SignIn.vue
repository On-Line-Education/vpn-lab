<template>
    <main class="mt-0 main-content main-content-bg">
        <section>
            <div class="page-header min-vh-75">
                <div class="container">
                    <div class="row">
                        <div
                            class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column"
                        >
                            <div class="mt-8 card card-plain">
                                <div class="pb-0 card-header text-start">
                                    <h3
                                        class="font-weight-bolder text-info text-gradient text-warning"
                                    >
                                        ON-Line Education
                                    </h3>
                                    <p class="mb-0">
                                        Podaj swoją nazwę użytkownika i hasło
                                        aby się zalogować
                                    </p>
                                </div>
                                <div class="card-body">
                                    <form role="form" class="text-start">
                                        <label>Nazwa użytkownika</label>
                                        <vsud-input
                                            type="text"
                                            placeholder="Nazwa użytkownika"
                                            name="username"
                                            ref="username"
                                        />
                                        <label>Hasło</label>
                                        <vsud-input
                                            type="password"
                                            placeholder="Hasło"
                                            name="password"
                                            ref="password"
                                        />
                                        <div class="text-center">
                                            <vsud-button
                                                class="my-4 mb-2"
                                                variant="gradient"
                                                color="warning"
                                                fullWidth
                                                type="button"
                                                @click="passwordLogin()"
                                                >Zaloguj się
                                            </vsud-button>
                                        </div>
                                    </form>
                                    <p class="text-center mt-4">Lub</p>
                                    <form role="form" class="text-start">
                                        <label>Kod dostępu</label>
                                        <vsud-input
                                            type="password"
                                            placeholder="Kod dostępu"
                                            name="accessCode"
                                            ref="loginCode"
                                        />
                                        <div class="text-center">
                                            <vsud-button
                                                class="my-4 mb-2"
                                                variant="gradient"
                                                color="warning"
                                                fullWidth
                                                type="button"
                                                @click="codeLogin()"
                                                >Zaloguj się
                                            </vsud-button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div
                                class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8"
                            >
                                <div
                                    class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                                    :style="{
                                        backgroundImage:
                                            'url(' +
                                            require('../assets/img/curved-images/curved9.jpg') +
                                            ')',
                                    }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import VsudInput from "../components/Basic/VsudInput.vue";
import VsudSwitch from "../components/Basic/VsudSwitch.vue";
import VsudButton from "../components/Basic/VsudButton.vue";

import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const body = document.getElementsByTagName("body")[0];
const store = useStore();
const router = useRouter();

var loginCode = ref(null),
    username = ref(null),
    password = ref(null);

function passwordLogin() {
    //
    console.log({ func: "passwordLogin", loginCode, username, password });
}

function codeLogin() {
    //
    console.log({ func: "codeLogin", loginCode, username, password });
}

function fakeLogin() {
    store.commit("toggleLoggedIn", true);
    router.push({ name: "HUBy" });
}

onBeforeMount(() => {
    store.state.hideConfigButton = true;
    store.state.showNavbar = false;
    store.state.showSidenav = false;
    store.state.showFooter = false;
    body.classList.remove("bg-gray-100");
});

onBeforeUnmount(() => {
    store.state.hideConfigButton = false;
    store.state.showNavbar = true;
    store.state.showSidenav = true;
    store.state.showFooter = true;
    body.classList.add("bg-gray-100");
});

if (store.state.token) {
    router.push({ name: "HUBy" });
}
</script>
