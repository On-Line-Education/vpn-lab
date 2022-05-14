<template>
    <div class="py-4 container-fluid">
        <div class="row" v-if="reactiveHub.hub != null">
            <div class="col-12">
                <HubsDetailsTable :hub="reactiveHub.hub" />
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
import HubsDetailsTable from "../components/Tables/HubsDetailsTable.vue";
import Card from "../components/Cards/Card.vue";
import { useStore } from "vuex";
import { reactive } from "vue";
const store = useStore();

var reactiveHub = reactive({ hub: null });

setTimeout(() => {
    reactiveHub.hub = [
        { username: "Aaa", group: "1", online: true },
        { username: "Bbb", group: "2", online: false },
    ];
}, 1000);
</script>
