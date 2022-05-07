<template>
    <h1>Trwa wylogowywanie</h1>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();

store.state.token = null;

router.push({ name: "Zaloguj się" });
</script>
