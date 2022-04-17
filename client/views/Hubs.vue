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
import { reactive } from "vue";
const store = useStore();

var reactiveHubs = reactive({ hubs: null });

setTimeout(() => {
    reactiveHubs.hubs = [
        {
            name: "Aaa",
            school: "Wiszniowa",
            status: "Działa",
            working: true,
            id: 1,
        },
        {
            name: "Bbb",
            school: "Wuwsi",
            status: "Offline",
            working: false,
            id: 2,
        },
    ];
}, 1000);
</script>
