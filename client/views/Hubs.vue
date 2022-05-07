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
<script setup lang="ts">
import HubsTable from "../components/Tables/HubsTable.vue";
import Card from "../components/Cards/Card.vue";
import { useStore } from "vuex";
import { onMounted, reactive, watch } from "vue";
const store = useStore();

var reactiveHubs = reactive({ hubs: null });

onMounted(() => {
    store.dispatch("listHubs");
});

// HubName_str
// Online_bool

watch(
    () => store.getters.hubsList,
    function () {
        console.log("value changes detected");
        let hubs = [],
            id = 0;
        store.getters.hubsList.forEach((hub) => {
            hubs.push({
                name: hub.HubName_str,
                school: "TODO",
                status: hub.Online_bool ? "Online" : "Offline",
                working: hub.Online_bool,
                id: id++,
            });
        });

        reactiveHubs.hubs = hubs;
    }
);
</script>
