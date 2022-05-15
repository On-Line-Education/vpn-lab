<template>
    <div class="py-4 container-fluid">
        <div class="row" v-if="reactiveHubs.hubs != null">
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
</template>
<script setup>
import HubsTable from "../components/Tables/HubsTable.vue";
import Card from "../components/Cards/Card.vue";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
const store = useStore();

const reactiveHubs = reactive({ hubs: null });

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
