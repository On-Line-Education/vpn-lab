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
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useStore();

var reactiveHub = reactive({ hub: null });

onMounted(async () => {
    // let hub = await store.getters.getServer.getHub(route.params.hubname);

    let hubUsers = [];
    let users = await store.getters.getServer.listHubUsers(
        route.params.hubname
    );
    users.data.getHubUsers.forEach((user) => {
        hubUsers.push({
            username: user.Name_str,
            group: user.GroupName_str ? user.GroupName_str : "-",
        });
    });
    reactiveHub.hub = hubUsers;
});

// setTimeout(() => {
//     reactiveHub.hub = [
//         { username: "Aaa", group: "1", online: true },
//         { username: "Bbb", group: "2", online: false },
//     ];
// }, 1000);
</script>
