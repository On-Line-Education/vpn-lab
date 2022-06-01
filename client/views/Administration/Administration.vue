<template>
    <div class="py-4 container-fluid">
        <div class="d-flex flex-column">
            <Import />
            <IPSec />
        </div>
    </div>
</template>
<script setup>
import { ref } from "vue";
import Import from "./Import.vue";
import IPSec from "./IPSec.vue";
</script>
