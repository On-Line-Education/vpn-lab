<template>
    <file-input-card
        title="Importuj użytkowników"
        titleColor="opacity-7"
        iconClass="text-white fas fa-solid fa-users"
        iconBackground="bg-gradient-warning"
        buttonName="Importuj"
        @returnValue="returnValue"
        buttonVaiant="gradient"
    />
</template>
<script setup lang="ts">
import FileInputCard from "../../components/Cards/FileInputCard";

function returnValue(val) {
    console.log(val[0]);
    var fReader = new FileReader();
    fReader.readAsText(val[0]);
    fReader.onloadend = function (event) {
        console.log(event.target.result);
    };
}
</script>
