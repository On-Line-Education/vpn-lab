<template>
    <div class="py-4 container-fluid">
        <div class="d-flex flex-column">
            <div class="mb-4 card mw-fc">
                <div class="card-header pb-0 d-flex justify-content-between">
                    <h6>Ustawienia</h6>
                    <div>
                        <div
                            class="text-center shadow icon icon-shape border-radius-md bg-gradient-warning"
                        >
                            <i
                                class="text-lg opacity-10 text-white fas fa-solid fa-gears"
                                aria-hidden="true"
                            ></i>
                        </div>
                    </div>
                </div>
                <div class="p-3 card-body">
                    <form
                        class="d-flex flex-column justify-content-between"
                        @submit.prevent="save()"
                    >
                        <input
                            type="password"
                            placeholder="Zmień hasło"
                            name="password"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="newPassword"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Powtórz hasło"
                            name="passwordRepeat"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="newPasswordRepeat"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Powtórz stare hasło"
                            name="oldpassword"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="oldPassword"
                            required
                        />
                        <input
                            type="submit"
                            class="btn bg-gradient-info"
                            value="Zapisz"
                        />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const newPassword = ref();
const newPasswordRepeat = ref();
const oldPassword = ref();

async function save() {
    console.log({ op: oldPassword.value.value, np: newPassword.value.value });
    if (newPassword.value.value !== newPasswordRepeat.value.value) {
        store.commit("setError", { message: "Podane hasła nie są takie same" });
        return;
    }
    if (newPassword.value.value === oldPassword.value.value) {
        store.commit("setError", {
            message: "Hasła są identyczne",
        });
        return;
    }
    let res = await store.getters.getServer.changeUserSettings({
        newPassword: newPassword.value.value,
        oldPassword: oldPassword.value.value,
    });
    console.log(res);
    if (res.data.changeUserSettings) {
        store.commit("showAlert", { message: "Zmiany zostały zapisane" });
    } else {
        store.commit("setError", {
            message: "Wystąpił niespodziewany problem",
        });
    }
}
</script>
