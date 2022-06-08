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
                        <tr v-for="user in reactiveHub.hub.sortData.data" :key="user.key">
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
                                    v-if="user.group.length > 0"
                                >
                                <span v-for="(group, index) in user.group">
                                    <span v-if="index+1==user.group.length || user.group.length < 2">
                                    {{ group }} 
                                    </span>
                                    <span v-else>
                                    {{ group }}, 
                                    </span>
                                </span>
                                </p>
                                <p class="text-xs font-weight-bold mb-0" v-else>
                                    -
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
                                <!-- <vsud-button
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
                                </vsud-button> -->
                                <vsud-button
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                    @click="changeGroups(user.username)"
                                >
                                    Edytuj grupy
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
        <div class="modal" tabindex="-1" role="dialog" ref="showGroupsEdit">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edytuj grupy</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeModal"
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
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="addUserToGroup"
                        >
                            Dodaj
                        </button>
                        <hr>
                        <div>
                            <div class="d-flex" style="list-style-type: none; font-size: 24px" v-for="group in selectedUserGroups.groups">
                                <button class="btn btn-outline-danger" style="margin-right: 5px" @click="removeFromGroup(selectedUser.username, group)">
                                    Usuń
                                </button> {{group}}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeModal"
                        >
                            Zamknij
                        </button>
                        <!-- <button
                            type="button"
                            class="btn bg-gradient-primary"
                            ref="inputGroupDoneModal"
                        >
                            Gotowe
                        </button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4" style="z-index: 10;">
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

    <div class="col-md-4" style="z-index: 10;">
        <!-- Modal -->
        <div class="modal" tabindex="-1" role="dialog" ref="cantModal">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Nie można wykonać tej operacji</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closaCantModal()"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">Próbujesz przypisać użytkownika do grupy, w której już się znajduje</div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closaCantModal()"
                        >
                            Zamknij
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
import TableSorter from "../../plugins/table-sorter";

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

const showGroupsEdit = ref();
const selectedUserGroups = reactive({groups:[]});
const selectedUser = reactive({username:''});

const cantModal = ref();

const usureModal = ref();
const usureYesModal = ref();

var reactiveHub = reactive({ hub: [] });

const date = computed(() => {
    return Date.now();
});

function closaCantModal() {
    cantModal.value.style.display = "none";
}

function updateGroupData() {
    let username = selectedUser.username;
    if(username == null || username.trim() == ""){
        return;
    }
    selectedUserGroups.groups = reactiveHub.hub.find(e=>{
        return e.username == username;
    }).group;
}

async function changeGroups(username) {
    selectedUser.username = username;
    updateGroupData();

    showGroupsEdit.value.style.display = "block";
}

async function refreshUsers() {
    let hubUsers = [];
    let users = await store.getters.getServer.listHubUsers(hubname);
    users.data.getHubUsers.forEach((userGroup) => {
        hubUsers.push({
            username: userGroup.user.Name_str,
            group: userGroup.groups ? userGroup.groups : [],
        });
    });
    reactiveHub.hub = new TableSorter(hubUsers.map((el, index) => {
        el.key = date + index;
        return el;
    }));
    updateGroupData();
}

async function refresh() {
    groups.value = (
        await store.getters.getServer.listSystemGroupsInHub(hubname)
    ).data.listSystemGroups;
}

async function addUserToGroup() {
    let username = selectedUser.username;
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
            return;
        }
    }

    if(selectedUserGroups.groups.includes(groupName)){
        cantModal.value.style.display = "block";
        return;
    }
    await store.getters.getServer.addUserToGroup(
        hubname,
        groupName,
        username
    );
    await refresh();
    await refreshUsers();
}

onMounted(() => {
    refresh();
    refreshUsers();
});

function closeModal() {
    showGroupsEdit.value.style.display = "none";
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

function removeFromGroup(username, group) {
    // are you sure
    usureModal.value.style.display = "block";
    const cl = async () => {
        closeUsureModal();
        await store.getters.getServer.removeFromSystemGroup(hubname, username, group);
        usureYesModal.value.removeEventListener("click", cl);
        await refreshUsers();
    };
    usureYesModal.value.addEventListener("click", cl);
}

function changeGroup(username) {
    addToGroup(username);
}
</script>
