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
                                    <form
                                        role="form"
                                        class="text-start form-group"
                                        @submit.prevent="passwordLogin()"
                                    >
                                        <label>Nazwa użytkownika</label>
                                        <input
                                            type="text"
                                            placeholder="Nazwa użytkownika"
                                            class="form-control"
                                            name="username"
                                            ref="username"
                                        />
                                        <label>Hasło</label>
                                        <input
                                            type="password"
                                            placeholder="Hasło"
                                            class="form-control"
                                            name="password"
                                            ref="password"
                                        />
                                        <div class="text-center">
                                            <button
                                                class="my-4 mb-2 btn bg-gradient-warning btn-lg w-100"
                                                type="button"
                                                :disabled="disableButtons"
                                                @click="passwordLogin()"
                                            >
                                                Zaloguj się
                                            </button>
                                        </div>
                                    </form>
                                    <p class="text-center mt-4">Lub</p>
                                    <form
                                        role="form"
                                        class="text-star form-group"
                                        @submit.prevent="codeLogin()"
                                    >
                                        <label>Kod dostępu</label>
                                        <input
                                            type="password"
                                            placeholder="Kod dostępu"
                                            class="form-control"
                                            name="accessCode"
                                            ref="loginCode"
                                        />
                                        <div class="text-center">
                                            <button
                                                class="my-4 mb-2 btn bg-gradient-warning btn-lg w-100"
                                                type="button"
                                                :disabled="disableButtons"
                                                @click="codeLogin()"
                                            >
                                                Zaloguj się
                                            </button>
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

<script setup>
import VsudSwitch from "../components/Basic/VsudSwitch.vue";
import VsudButton from "../components/Basic/VsudButton.vue";

import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

var loginCode = ref(null),
    username = ref(null),
    password = ref(null),
    disableButtons = ref(false);

function passwordLogin() {
    store.dispatch("loginViaPassword", { username: username.value.value, password: password.value.value });
}

function codeLogin() {
    store.dispatch("loginViaKey", loginCode.value.value);
}

watch(
    () => store.getters.isLoggedIn,
    (isLoggedIn, old) => {
        if (isLoggedIn) {
            router.push({ name: "Panel" });
        }
    }
);

if (store.getters.isLoggedIn) {
    router.push({ name: "Panel" });
}
</script>
