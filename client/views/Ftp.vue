<template>
    <div class="py-4 container-fluid">
        <div class="d-flex" v-for="file in files">
            <file-card
                :name="file.name"
                :path="file.path"
                :can-download="file.canDownload"
                download-button-name="Pobierz"
                download-button-vaiant="gradient"
                download-button-color="info"
                dir-button-name="Przejdź"
                dir-button-vaiant="gradient"
                dir-button-color="success"
                @enter-dir="ed"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import FileCard from "../components/Cards/FileCard.vue";
import { useStore } from "vuex";
const store = useStore();

const files = [
    { name: "..", path: "/home/", canDownload: false },
    { name: "PLik1.txt", path: "/home/usr/PLik1.txt" },
    { name: "plik3.txt", path: "/home/usr/plik3.txt" },
];

function ed(path) {
    console.log(path);
}
</script>
