<template>
    <div
        class="shadow-none card card-background card-background-mask-secondary"
        id="sidenavCard"
    >
        <div
            class="full-background"
            :style="{ 'background-image': 'url(' + imgWhiteCurved + ')' }"
        ></div>
        <div class="p-3 card-body text-start w-100">
            <div
                class="mb-3 text-center bg-white shadow icon icon-shape icon-sm d-flex align-items-center justify-content-center border-radius-md"
            >
                <i
                    class="top-0 text-lg text-dark text-gradient"
                    aria-hidden="true"
                    :class="iconClass"
                    id="sidenavCardIcon"
                ></i>
            </div>
            <div class="docs-info">
                <h6 class="mb-0 text-white up">{{ textPrimary }}</h6>
                <p class="text-xs font-weight-bold">{{ textSecondary }}</p>
                <a
                    :href="href"
                    target="_blank"
                    class="mb-0 btn btn-white btn-sm w-100"
                    >{{ linkText }}
                </a>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import imgWhiteCurved from "../../../assets/img/curved-images/white-curved.jpeg";

const { textPrimary, textSecondary, href, linkText, iconClass } = defineProps({
    textPrimary: String,
    textSecondary: String,
    href: String,
    linkText: String,
    iconClass: String,
});
</script>
