<template>
    <div class="py-4 container-fluid">
        <div class="row" v-if="reactiveHubs.hubs != null" :key="reactiveHubs.hubs.length">
            <div class="col-12">
                <HubsTable :hubs="reactiveHubs.hubs" />
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
    </div>
    <div class="d-flex" v-if="isAdmin">
        <div class="mb-4 card full-width">
            <div class="p-3 card-body flex-space-between">
                <div class="d-flex flex-row-reverse justify-content-between">
                    <div class="numbers">
                        <h3>Dodaj hub</h3>
                        <label>Nazwa huba:</label>
                        <input
                            type="text"
                            placeholder="Nazwa huba"
                            name="name"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="hubname"
                        />
                        <label>Nazwa konta instruktora:</label>
                        <input
                            type="text"
                            placeholder="Nazwa konta instruktora"
                            name="name"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="instructorName"
                        />
                        <label>Hasło instruktora:</label>
                        <input
                            type="password"
                            placeholder="Hasło instruktora"
                            name="password"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="instructorPassword"
                        />
                        <label>Kod dostępu instruktora:</label>
                        <input
                            type="password"
                            placeholder="Kod dostępu instruktora"
                            name="passcode"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="instructorPasscode"
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
const instructorPassword = ref();
const instructorPasscode = ref();

const reactiveHubs = reactive({ hubs: null });


async function addHub() {
    let hn = hubname.value.value,
    iname = instructorName.value.value,
    ipassword = instructorPassword.value.value,
    ipasscode = instructorPasscode.value.value;

    if(hn == null || hn.trim() == ""){
        store.commit("setError", {
            message: "Należy podać nazwę huba",
        });
        return;
    }
    if(iname == null || iname.trim() == ""){
        store.commit("setError", {
            message: "Należy podać nazwę dla konta instruktora",
        });
        return;
    }
    if(ipassword == null || ipassword.trim() == ""){
        store.commit("setError", {
            message: "Należy podać hasło dla konta instruktora",
        });
        return;
    }
    if(ipasscode == null || ipasscode.trim() == ""){
        store.commit("setError", {
            message: "Należy podać kod dostępu dla konta instruktora",
        });
        return;
    }

    try{
        await store.getters.getServer.createNewHub(hn, iname, ipassword, ipasscode);
    } catch(e){
        store.commit("setError", e);
        return;
    }
    hubname.value.value = "";
    instructorName.value.value = "";
    instructorPassword.value.value = "";
    instructorPasscode.value.value = "";
    store.commit('showAlert', {message: "Hub został utworzony"});
    await refreshHubs();
}

async function refreshHubs() {
    try {
        let hubs = await store.getters.getServer.listHubs(),
            hubsList = [],
            id = 0;
        hubs.data.listHubs.HubList.forEach((hub) => {
            hubsList.push({
                name: hub.HubName_str,
                school: "TODO",
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
