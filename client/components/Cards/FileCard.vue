<template>
    <div class="mb-4 card full-width">
        <div class="p-3 card-body flex-space-between">
            <div class="d-flex flex-row-reverse justify-content-between">
                <h5 class="mb-0 font-weight-bolder">
                    {{ name }}
                </h5>
            </div>
            <div>
                <button @click="download" class="btn bg-gradient-info">
                    Pobierz
                </button>
                <button
                    v-if="isAdmin"
                    class="btn bg-gradient-danger"
                    @click="del"
                >
                    Usuń
                </button>
                <button
                    v-if="isAdmin"
                    class="btn bg-gradient-warning"
                    @click="edit"
                >
                    Edytuj
                </button>
            </div>
        </div>
    </div>
    <div style="z-index: 10000">
        <!-- Modal -->
        <div class="modal modal-custom" tabindex="-1" role="dialog" ref="modal">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edytuj wpis</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeModal()"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="numbers">
                            <label>Nazwa:</label>
                            <input
                                type="text"
                                placeholder="Nazwa"
                                name="name"
                                class="form-control d-flex justify-content-start mb-3"
                                ref="ftpName"
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
                                    v-for="permission in permissions"
                                    :value="permission"
                                    :selected="permission == perms"
                                >
                                    {{ permission }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeModal()"
                        >
                            Anuluj
                        </button>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="saveEdit()"
                        >
                            Zapisz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style="z-index: 10001">
        <!-- Modal -->
        <div
            class="modal modal-custom"
            tabindex="-1"
            role="dialog"
            ref="usureModal"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Czy na pewno?</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeUsureModal()"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeUsureModal()"
                        >
                            Nie
                        </button>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="deleteEntrance()"
                        >
                            Tak
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import VsudInput from "../Basic/VsudInput.vue";
import VsudButton from "../Basic/VsudButton.vue";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
const store = useStore();

const { id, name, path, perms, isAdmin } = defineProps({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    perms: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
});

const modal = ref();
const permissions = ref();
const selectedPermission = ref();
const url = ref();
const ftpName = ref();

const emit = defineEmits(["reload"]);

function download() {
    window.open(path, "_blank");
}

onMounted(async () => {
    let permsList = await store.getters.getServer.getRoles();
    permissions.value = permsList.data.getRoles;
    ftpName.value.value = name;
    url.value.value = path;
});

async function del() {
    usureModal.value.style.display = "table";
}

async function deleteEntrance() {
    await store.getters.getServer.deleteFile(id);
    emit("reload");
}

function edit() {
    modal.value.style.display = "block";
}

async function saveEdit() {
    if (
        !(
            url.value.value.includes("http://") ||
            url.value.value.includes("https://")
        )
    ) {
        store.commit("setError", {
            message: "Url musi się zaczynać od https:// lub http://",
        });
        return;
    }
    await store.getters.getServer.editFile(
        ftpName.value.value,
        url.value.value,
        selectedPermission.value.value.toUpperCase(),
        id
    );
    closeModal();
    emit("reload");
}

function closeModal() {
    modal.value.style.display = "none";
}

function closeUsureModal() {
    usureModal.value.style.display = "none";
}
</script>
