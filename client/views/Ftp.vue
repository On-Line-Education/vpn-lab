<template>
    <div class="py-4 container-fluid">
        <div class="d-flex" v-for="file in files.files">
            <file-card
                :name="file.name"
                :path="file.url"
                :isAdmin="isAdmin"
                :id="file.id"
                @reload="reload"
            />
        </div>
        <div class="d-flex" v-if="isAdmin">
            <div class="mb-4 card full-width">
                <div class="p-3 card-body flex-space-between">
                    <div class="d-flex flex-row-reverse justify-content-between">
                            <div class="numbers">
                                <label>Nazwa:</label>
                                <input
                                    type="text"
                                    placeholder="Nazwa"
                                    name="name"
                                    class="form-control d-flex justify-content-start mb-3"
                                    ref="name"
                                />
                                <label>Url:</label>
                                <input
                                    type="text"
                                    placeholder="Url"
                                    name="url"
                                    class="form-control d-flex justify-content-start mb-3"
                                    ref="url"
                                />
                                <label>Uprawnienia:</label>
                                <select
                                    class="form-control mb-3"
                                    ref="selectedPermission"
                                >
                                    <option
                                        v-for="perm in permissions"
                                        :value="perm"
                                    >
                                        {{ perm }}
                                    </option>
                                </select>
                        </div>
                    </div>
                    <vsud-button
                        variant="gradient"
                        color="success"
                        @click="add"
                        >Dodaj</vsud-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import FileCard from "../components/Cards/FileCard.vue";
import { useStore } from "vuex";
import { onBeforeMount, onMounted, reactive, ref } from "@vue/runtime-core";
import VsudButton from "../components/Basic/VsudButton.vue";
const store = useStore();

const isAdmin = store.getters.getRole == "admin";
const permissions = ref();
const selectedPermission = ref();
const url = ref();
const name = ref();
const files = reactive({files: []});

const reload = async () => {
    let perms = await store.getters.getServer.getRoles();
    permissions.value = perms.data.getRoles;

    let fileList = await store.getters.getServer.getFiles();
    files.files = fileList.data.getFilesList;
}

onMounted(reload());

async function add() {
    if(!(url.value.value.includes('http://') || url.value.value.includes('https://'))){
        store.commit("setError", {message: "Url musi się zaczynać od https:// lub http://"});
        return;
    }
    await store.getters.getServer.addFile(name.value.value, url.value.value, selectedPermission.value.value.toUpperCase());
    await reload();
    name.value.value = "";
    url.value.value = "";
}

</script>
