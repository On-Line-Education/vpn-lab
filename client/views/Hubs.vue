<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <HubsTable />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import HubsTable from "../components/Tables/HubsTable.vue";
import { useStore } from "vuex";
const store = useStore();

store.state.showSidenav = true;

const hi = "Hello!";
</script>
