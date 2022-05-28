<template>
    <div class="py-4 container-fluid">
        <div class="row">
            <div class="col-12">
                <HubsDetailsTable :hubname="route.params.hubname" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import HubsDetailsTable from "../components/Tables/HubsDetailsTable.vue";

const route = useRoute();
</script>
