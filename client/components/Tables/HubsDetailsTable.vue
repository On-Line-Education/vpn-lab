<template>
    <card
        v-if="reactiveHub.hub.length == 0"
        title="Wczytywanie danych"
        value="Prosimy poczekać"
        titleColor="opacity-7"
        iconClass="text-white fas fa-solid fa-spinner"
        iconBackground="bg-gradient-warning"
    />
    <div class="card mb-4" v-else>
        <div class="card-header pb-0">
            <h6>Lista Użytkowników</h6>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                            >
                                Nazwa użytkownika
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2"
                            >
                                Grupa
                            </th>
                            <!-- <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Status
                            </th> -->
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                            >
                                Działania
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in reactiveHub.hub" :key="user.key">
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                    >
                                        <h6 class="mb-0 text-sm">
                                            {{ user.username }}
                                        </h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p
                                    class="text-xs font-weight-bold mb-0"
                                    v-if="user.group"
                                >
                                    {{ user.group }}
                                </p>
                                <p class="text-xs font-weight-bold mb-0" v-else>
                                    ---BRAK---
                                </p>
                            </td>
                            <!-- <td class="align-middle text-center text-sm">
                                <vsud-badge
                                    v-if="user.online"
                                    color="success"
                                    variant="gradient"
                                    size="sm"
                                    >Online</vsud-badge
                                >
                                <vsud-badge
                                    v-else
                                    color="secondary"
                                    variant="gradient"
                                    size="sm"
                                    >Offline</vsud-badge
                                >
                            </td> -->
                            <!-- <td class="align-middle">
                                <a
                                    href="javascript:;"
                                    class="text-secondary font-weight-bold text-xs"
                                    data-toggle="tooltip"
                                    data-original-title="Zobacz więcej"
                                    >user.group</a
                                >
                            </td> -->
                            <td class="align-middle">
                                <vsud-button
                                    color="warning"
                                    variant="outline"
                                    size="sm"
                                    :disabled="!user.group"
                                    @click="removeFromGroup(user.username)"
                                >
                                    Usuń z grupy
                                </vsud-button>
                                <vsud-button
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                    @click="changeGroup(user.username)"
                                    v-if="user.group"
                                >
                                    Zmień grupę
                                </vsud-button>
                                <vsud-button
                                    color="success"
                                    variant="outline"
                                    size="sm"
                                    @click="addToGroup(user.username)"
                                    v-else
                                >
                                    Dodaj do grupy
                                </vsud-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <!-- Modal -->
        <div class="modal" tabindex="-1" role="dialog" ref="inputGroupModal">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Podaj nazwę grupy</h5>
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
                        <div class="form-group">
                            <div
                                class="form-check"
                                v-if="(groups.value?.length ?? []) > 0"
                            >
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="newGroup"
                                    :disabled="
                                        (groups.value?.length ?? []) == 0
                                    "
                                    ref="newGroupCheckbox"
                                />
                                <label class="custom-control-label"
                                    >Nowa grupa</label
                                >
                            </div>
                            <select
                                class="form-control"
                                :disabled="newGroup"
                                ref="selectedGroup"
                                v-if="(groups.value?.length ?? []) > 0"
                            >
                                <option
                                    v-for="group in groups.value"
                                    :value="group"
                                >
                                    {{ group }}
                                </option>
                            </select>
                            <input
                                type="text"
                                class="form-control"
                                value=""
                                ref="inputGroupNameModal"
                                :disabled="
                                    !newGroup &&
                                    (groups.value?.length ?? []) > 0
                                "
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeModal()"
                        >
                            Zamknij
                        </button>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            ref="inputGroupDoneModal"
                        >
                            Gotowe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4">
        <!-- Modal -->
        <div class="modal" tabindex="-1" role="dialog" ref="usureModal">
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
                            ref="usureYesModal"
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
import VsudButton from "../Basic/VsudButton.vue";
import VsudAvatar from "../Basic/VsudAvatar.vue";
import VsudBadge from "../Basic/VsudBadge.vue";
import Card from "../Cards/Card.vue";
import { ref, reactive } from "vue";
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { watch } from "@vue/runtime-core";
import { computed } from "@vue/reactivity";

const { hubname } = defineProps({
    hubname: String,
});

const store = useStore();

const groups = reactive([]);
const newGroup = ref();
const newGroupCheckbox = ref();
const selectedGroup = ref();
const inputGroupModal = ref();
const inputGroupNameModal = ref();
const inputGroupDoneModal = ref();

const usureModal = ref();
const usureYesModal = ref();

var reactiveHub = reactive({ hub: [] });

const date = computed(() => {
    return Date.now();
});

async function refreshUsers() {
    let hubUsers = [];
    let users = await store.getters.getServer.listHubUsers(hubname);
    users.data.getHubUsers.forEach((userGroup) => {
        hubUsers.push({
            username: userGroup.user.Name_str,
            group: userGroup.group ? userGroup.group : null,
        });
    });
    reactiveHub.hub = hubUsers.map((el, index) => {
        el.key = date + index;
        return el;
    });
}

async function refresh() {
    groups.value = (
        await store.getters.getServer.listSystemGroupsInHub(hubname)
    ).data.listSystemGroups;
}

onMounted(() => {
    refresh();
    refreshUsers();
});

function closeModal() {
    inputGroupModal.value.style.display = "none";
}

async function closeUsureModal() {
    usureModal.value.style.display = "none";
}

function addToGroup(username) {
    // modal add to group
    inputGroupNameModal.value.value = "";
    inputGroupModal.value.style.display = "block";
    const cl = async () => {
        closeModal();
        // add to group
        let groupName = "";
        if (newGroupCheckbox.value?.checked ?? true) {
            groupName = inputGroupNameModal.value.value;
        } else {
            if (selectedGroup.value.value) {
                groupName = selectedGroup.value.value;
            } else {
                store.commit("setError", {
                    message: "Wystąpił błąd podczas określania grupy",
                });
                inputGroupDoneModal.value.removeEventListener("click", cl);
                return;
            }
        }

        await store.getters.getServer.addUserToGroup(
            hubname,
            groupName,
            username
        );

        await refresh();
        inputGroupDoneModal.value.removeEventListener("click", cl);
        await refreshUsers();
    };
    inputGroupDoneModal.value.addEventListener("click", cl);
}

function removeFromGroup(username) {
    // are you sure
    usureModal.value.style.display = "block";
    const cl = async () => {
        closeUsureModal();
        await store.getters.getServer.removeFromSystemGroup(hubname, username);
        usureYesModal.value.removeEventListener("click", cl);
        await refreshUsers();
    };
    usureYesModal.value.addEventListener("click", cl);
}

function changeGroup(username) {
    addToGroup(username);
}
</script>
