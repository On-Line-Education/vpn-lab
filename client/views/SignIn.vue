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
                                            @keypress="triggerLogin($event)"
                                        />
                                        <label>Hasło</label>
                                        <input
                                            type="password"
                                            placeholder="Hasło"
                                            class="form-control"
                                            name="password"
                                            ref="password"
                                            @keypress="triggerLogin($event)"
                                        />
                                        <small
                                            @mousedown="showPassword()"
                                            @mouseup="hidePassword()"
                                            @touchstart="showPassword()"
                                            @touchend="hidePassword()"
                                            style="cursor: pointer"
                                            >Podgląd hasła</small
                                        >
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

var username = ref(null),
    password = ref(null),
    disableButtons = ref(false);

function triggerLogin(event) {
    if (event.charCode === 13) {
        passwordLogin();
    }
}

function showPassword() {
    password.value.type = "text";
}

function hidePassword() {
    password.value.type = "password";
}

function passwordLogin() {
    disableButtons.value = true;
    store.getters.getServer
        .loginViaPassword({
            username: username.value.value,
            password: password.value.value,
        })
        .then((res) => {
            disableButtons.value = false;
            store.commit("setLoggedIn", true);
            store.commit("loginState");
        })
        .catch((e) => {
            disableButtons.value = false;
            store.commit("setError", e);
        });
}

watch(
    () => store.getters.isLoggedIn,
    (isLoggedIn, old) => {
        if (isLoggedIn) {
            router.push({ name: "Panel" });
        }
    }
);

watch(
    () => store.getters.isLoggedIn,
    (isLoggedIn, old) => {
        if (isLoggedIn) {
            disableButtons.value = false;
            router.push({ name: "Panel" });
        }
    }
);

if (store.getters.isLoggedIn) {
    router.push({ name: "Panel" });
}
</script>
