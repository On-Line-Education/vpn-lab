<template>
    <h1>Trwa wylogowywanie</h1>
</template>
<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const store = useStore();
const router = useRouter();

store.dispatch("logout");

router.push({ name: "Zaloguj się" });
</script>
