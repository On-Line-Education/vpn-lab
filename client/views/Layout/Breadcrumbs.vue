<template>
    <nav aria-label="breadcrumb">
        <ol class="px-0 pt-1 pb-0 mb-0 bg-transparent breadcrumb me-sm-6">
            <li class="text-sm breadcrumb-item" :class="textWhite">
                <a :class="textWhite" class="opacity-8" href="#">{{
                    store.getters.appName
                }}</a>
            </li>
            <li
                class="text-sm breadcrumb-item active"
                :class="textWhite ? 'text-white' : 'text-dark'"
                aria-current="page"
            >
                {{ currentPage }}
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { defineProps } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { currentPage, textWhite } = defineProps({
    currentPage: {
        required: true,
    },
    textWhite: {
        type: String,
    },
});
</script>
