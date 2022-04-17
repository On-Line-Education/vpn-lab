<template>
    <div class="mb-4 card full-width">
        <div class="p-3 card-body flex-space-between">
            <div class="d-flex flex-row-reverse justify-content-between">
                <div :class="contentClass">
                    <div class="numbers">
                        <p class="mb-0 text-sm font-weight-bold">
                            {{ path }}
                        </p>
                        <h5 class="mb-0 font-weight-bolder">
                            {{ name }}
                        </h5>
                    </div>
                </div>
            </div>
            <vsud-button
                v-if="canDownload"
                :variant="downloadButtonVaiant"
                :size="downloadButtonSize"
                :color="downloadButtonColor"
                @click="download"
                >{{ downloadButtonName }}</vsud-button
            >
            <vsud-button
                v-else
                :variant="dirButtonVaiant"
                :size="dirButtonSize"
                :color="dirButtonColor"
                @click="enter"
                >{{ dirButtonName }}</vsud-button
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import VsudInput from "../Basic/VsudInput.vue";
import VsudButton from "../Basic/VsudButton.vue";
import { ref } from "vue";

const emit = defineEmits({
    enterDir: String,
    downloadFile: String,
});

const {
    name,
    path,
    downloadButtonName,
    downloadButtonSize,
    downloadButtonVaiant,
    downloadButtonColor,
    dirButtonName,
    dirButtonSize,
    dirButtonVaiant,
    dirButtonColor,
    contentClass,
    canDownload,
} = defineProps({
    directionReverse: Boolean,
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    downloadButtonName: {
        type: String,
        required: true,
    },
    downloadButtonSize: {
        type: String,
    },
    downloadButtonVaiant: {
        type: String,
    },
    downloadButtonColor: {
        type: String,
    },
    dirButtonName: {
        type: String,
        required: true,
    },
    dirButtonSize: {
        type: String,
    },
    dirButtonVaiant: {
        type: String,
    },
    dirButtonColor: {
        type: String,
    },
    contentClass: {
        type: String,
    },
    canDownload: {
        tyle: Boolean,
        default: true,
    },
});

function enter() {
    emit("enterDir", path);
}

function download() {
    emit("downloadFile", path);
}
</script>
