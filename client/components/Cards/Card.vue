<template>
    <div class="mb-4 card mw-fc">
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
                        <h5 class="mb-0 font-weight-bolder" :class="valueColor">
                            {{ value }}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const {
    title,
    titleColor,
    value,
    valueColor,
    iconClass,
    iconBackground,
    contentClass,
} = defineProps({
    directionReverse: Boolean,
    title: {
        type: String,
        required: true,
    },
    titleColor: {
        type: String,
    },
    value: {
        required: true,
    },
    valueColor: {
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
</script>
