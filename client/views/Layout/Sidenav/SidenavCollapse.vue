<template>
    <router-link class="nav-link" :to="to" v-bind="$attrs">
        <div
            class="text-center bg-white shadow icon icon-shape-dark icon-sm border-radius-md d-flex align-items-center justify-content-center"
            :class="'me-2'"
        >
            <slot name="icon"></slot>
        </div>
        <span class="nav-link-text" :class="'ms-1'">{{ navText }}</span>
    </router-link>
</template>
<script setup>
import { useStore } from "vuex";
const store = useStore();
var isExpanded = false;
const { to, navText } = defineProps({
    to: {
        type: [Object, String],
        required: true,
    },
    navText: {
        type: String,
        required: true,
    },
});
</script>
