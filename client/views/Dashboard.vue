<template>
    <h1>{{ hi }}</h1>
</template>
<script setup lang="ts">
import { useStore } from "vuex";
const store = useStore();

store.state.showSidenav = true;

const hi = "Hello!";
</script>
