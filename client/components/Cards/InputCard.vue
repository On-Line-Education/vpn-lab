<template>
    <div class="mb-4 card half-width">
        <div class="p-3 card-body">
            <div class="d-flex flex-row-reverse justify-content-between">
                <div>
                    <div
                        class="text-center shadow icon icon-shape border-radius-md"
                        :class="iconBackground"
                    >
                        <i
                            class="text-lg opacity-10"
                            :class="iconClass"
                            aria-hidden="true"
                        ></i>
                    </div>
                </div>
                <div :class="contentClass">
                    <div class="numbers">
                        <p
                            class="mb-0 text-sm text-capitalize font-weight-bold"
                            :class="titleColor"
                        >
                            {{ title }}
                        </p>
                        <div class="d-flex flex-row justify-content-evenly">
                            <input
                                v-model="inp"
                                class="mb-0 font-weight-bolder form-control"
                                :type="type"
                                style="margin-right: 5px"
                            />
                            <vsud-button
                                :variant="buttonVaiant"
                                :size="buttonSize"
                                @click="click"
                                >{{ buttonName }}</vsud-button
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import VsudInput from "../Basic/VsudInput.vue";
import VsudButton from "../Basic/VsudButton.vue";
import { ref } from "vue";

const inp = ref("");

const emit = defineEmits({
    returnValue: String,
});

const {
    title,
    titleColor,
    iconClass,
    iconBackground,
    contentClass,
    type,
    buttonName,
    buttonSize,
    buttonVaiant,
} = defineProps({
    directionReverse: Boolean,
    title: {
        type: String,
        required: true,
    },
    titleColor: {
        type: String,
    },
    type: {
        type: String,
    },
    buttonName: {
        type: String,
        required: true,
    },
    buttonVaiant: {
        type: String,
    },
    buttonSize: {
        type: String,
    },
    iconClass: {
        type: String,
        required: true,
    },
    iconBackground: {
        type: String,
        default: "bg-white",
    },
    contentClass: {
        type: String,
    },
});

function click() {
    emit("returnValue", inp.value);
}
</script>
