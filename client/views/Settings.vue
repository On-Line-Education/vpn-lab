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
                            type="text"
                            placeholder="Zmień nazwę"
                            name="password"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="newUsername"
                        />
                        <input
                            type="password"
                            placeholder="Zmień hasło"
                            name="password"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="newPassword"
                        />
                        <input
                            type="password"
                            placeholder="Powtórz hasło"
                            name="passwordRepeat"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="newPasswordRepeat"
                        />
                        <input
                            type="password"
                            placeholder="Powtórz aktualne hasło"
                            name="oldpassword"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="oldPassword"
                            required
                        />
                        <small
                            >Podanie starego hasła jest wymagane do
                            potwierdzenia zmian</small
                        >
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

const newUsername = ref();
const newPassword = ref();
const newPasswordRepeat = ref();
const oldPassword = ref();

async function save() {
    if (
        newPassword.value.value &&
        newPassword.value.value !== newPasswordRepeat.value.value
    ) {
        store.commit("setError", { message: "Podane hasła nie są takie same" });
        return;
    }
    if (newPassword.value.value === oldPassword.value.value) {
        store.commit("setError", {
            message: "Hasła są identyczne",
        });
        return;
    }
    if (newUsername.value.value.length < 3) {
        store.commit("setError", {
            message: "Nazwa użytkownika musi mieć minimum 3 znaki",
        });
        return;
    }
    let res = await store.getters.getServer.changeUserSettings({
        username: newUsername.value.value,
        newPassword: newPassword.value.value,
        oldPassword: oldPassword.value.value,
    });
    if (res.data.changeUserSettings) {
        store.commit("showAlert", { message: "Zmiany zostały zapisane" });
        if (newUsername.value.value) {
            store.commit("setUsername", newUsername.value.value);
        }
    } else {
        store.commit("setError", {
            message: "Wystąpił niespodziewany problem",
        });
    }
}
</script>
