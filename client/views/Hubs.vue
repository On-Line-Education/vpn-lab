<template>
    <div class="py-4 container-fluid">
        <div
            class="row"
            v-if="reactiveHubs.hubs != null"
            :key="reactiveHubs.hubs.length"
        >
            <div class="col-12">
                <HubsTable :hubs="reactiveHubs.hubs" @reload="refreshHubs()" />
            </div>
        </div>
        <card
            v-else
            title="Wczytywanie danych"
            value="Prosimy poczekać"
            titleColor="opacity-7"
            iconClass="text-white fas fa-solid fa-spinner"
            iconBackground="bg-gradient-warning"
        />
        <div class="d-flex" v-if="isAdmin">
            <div class="mb-4 card full-width">
                <div class="p-3 card-body flex-space-between">
                    <div
                        class="d-flex flex-row-reverse justify-content-between"
                    >
                        <div class="numbers">
                            <h3
                                class="tooltip-custom"
                                data-html="true"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="W celu prostrzego odróżnienia nazw użytkowników w systemie, zostaną one poprzedzone przedrostkiem z budowanym z nazwy huba oraz znaku podkreślenia"
                            >
                                Dodaj hub
                            </h3>
                            <label>Nazwa huba:</label>
                            <input
                                type="text"
                                placeholder="Nazwa huba"
                                name="name"
                                class="form-control d-flex justify-content-start mb-3"
                                ref="hubname"
                            />
                            <label
                                class="tooltip-custom"
                                data-html="true"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Jest to nazwa stała, którą uzytkownik ten będzie się identyfikował w VPN. Nie można jej później zmienić"
                                >Nazwa VPN konta instruktora:</label
                            >
                            <input
                                type="text"
                                placeholder="Nazwa VPN konta instruktora"
                                name="name"
                                class="form-control d-flex justify-content-start mb-3"
                                ref="instructorName"
                            />
                            <label>Nazwa konta instruktora:</label>
                            <input
                                type="text"
                                placeholder="Nazwa konta instruktora"
                                name="name"
                                class="form-control d-flex justify-content-start mb-3"
                                ref="instructorUsername"
                            />
                            <label>Hasło instruktora:</label>
                            <input
                                type="password"
                                placeholder="Hasło instruktora"
                                name="password"
                                class="form-control d-flex justify-content-start mb-3"
                                ref="instructorPassword"
                            />
                        </div>
                    </div>
                    <vsud-button
                        variant="gradient"
                        color="success"
                        @click="addHub"
                        >Dodaj</vsud-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import HubsTable from "../components/Tables/HubsTable.vue";
import VsudButton from "../components/Basic/VsudButton.vue";
import Card from "../components/Cards/Card.vue";
import { useStore } from "vuex";
import { onMounted, reactive, ref, watch } from "vue";
const store = useStore();

const isAdmin = store.getters.getRole == "admin";

const hubname = ref();
const instructorName = ref();
const instructorUsername = ref();
const instructorPassword = ref();

const reactiveHubs = reactive({ hubs: null });

async function addHub() {
    let hn = hubname.value.value,
        iusername = instructorUsername.value.value,
        iname = instructorName.value.value,
        ipassword = instructorPassword.value.value;

    if (hn == null || hn.trim() == "") {
        store.commit("setError", {
            message: "Należy podać nazwę huba",
        });
        return;
    }
    if (iname == null || iname.trim() == "") {
        store.commit("setError", {
            message: "Należy podać nazwę dla konta instruktora",
        });
        return;
    }
    if (ipassword == null || ipassword.trim() == "") {
        store.commit("setError", {
            message: "Należy podać hasło dla konta instruktora",
        });
        return;
    }

    if (iusername.trim() === "") {
        iusername = iname;
    }

    try {
        await store.getters.getServer.createNewHub(
            hn,
            iname,
            iusername,
            ipassword
        );
    } catch (e) {
        store.commit("setError", e);
        return;
    }
    hubname.value.value = "";
    instructorName.value.value = "";
    instructorPassword.value.value = "";
    store.commit("showAlert", { message: "Hub został utworzony" });
    await refreshHubs();
}

async function refreshHubs() {
    try {
        let hubs = isAdmin
                ? await store.getters.getServer.listHubs()
                : await store.getters.getServer.listUserHubs(),
            hubsList = [],
            id = 0;
        let fetchedHubs = hubs.data.listHubs
            ? hubs.data.listHubs
            : hubs.data.listUserHubs;
        fetchedHubs.HubList.forEach((hub) => {
            hubsList.push({
                name: hub.HubName_str,
                status: hub.Online_bool ? "Online" : "Offline",
                working: hub.Online_bool,
                id: id++,
            });
        });
        reactiveHubs.hubs = hubsList;
    } catch (e) {
        store.commit("setError", e);
        console.error(e);
    }
}

onMounted(refreshHubs);
</script>
