<template>
    <div class="py-4 container-fluid">
        <div class="d-flex flex-column">
            <Import />
            <IPSec v-if="isAdmin"/>
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import Import from "./Import.vue";
import IPSec from "./IPSec.vue";
import { useStore } from "vuex";

const store = useStore();

const isAdmin = store.getters.getRole == "admin";
</script>
