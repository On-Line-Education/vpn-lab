<template>
    <div class="card mb-4">
        <div class="card-header pb-0 flex-space-between">
            <h6>Lista Użytkowników</h6>
            <vsud-input
                type="text"
                placeholder="Szukaj"
                name="search"
                size="sm"
                @keyup="reactiveUsers.users.search($event.target.value)"
            ></vsud-input>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
            <div v-if="loading.inProgress" class="progress-custom">
            <div class="progress-message">Wczytywanie</div>
            <div class="progress-loading progress-bar progress-bar-striped bg-warning" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
                <table
                    v-if="
                        !(
                            reactiveUsers.users == null ||
                            reactiveUsers.users == undefined ||
                            reactiveUsers.users.sortData == null ||
                            reactiveUsers.users.sortData == undefined
                        )
                    "
                    class="table align-items-center mb-0 sortable"
                >
                    <thead>
                        <tr>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="reactiveUsers.users.sort('name')"
                            >
                                Nazwa VPN
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="reactiveUsers.users.sort('username')"
                            >
                                Nazwa
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="reactiveUsers.users.sort('hub')"
                            >
                                Hub
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="reactiveUsers.users.sort('group')"
                            >
                                Grupy
                            </th>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Akcje
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in reactiveUsers.users.sortData.data">
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                    >
                                        <h6 class="mb-0 text-sm">
                                            {{ user.name }}
                                        </h6>
                                    </div>
                                </div>
                            </td>
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
                                <div class="d-flex px-2 py-1">
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                    >
                                        <h6 class="mb-0 text-sm">
                                            {{ user.hub }}
                                        </h6>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div
                                    class="d-flex px-2 py-1"
                                    v-if="user.group.length > 0"
                                >
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                        v-for="(group, index) in user.group"
                                    >
                                        <h6
                                            class="mb-0 text-sm"
                                            v-if="
                                                index + 1 ==
                                                    user.group.length ||
                                                user.group.length < 2
                                            "
                                        >
                                            {{ group }}
                                        </h6>
                                        <h6 class="mb-0 text-sm" v-else>
                                            {{ group }},
                                        </h6>
                                    </div>
                                </div>
                                <p class="text-xs font-weight-bold mb-0" v-else>
                                    -
                                </p>
                            </td>
                            <td class="align-middle">
                                <vsud-button
                                    @click="edit(user.name, user.username)"
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                    v-if="(user.name !== loggedInUserVpnName && user.role !== 'instructor') || isAdmin"
                                >
                                    Edytuj
                                </vsud-button>
                                <vsud-button
                                    @click="openGroupModal(user)"
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                >
                                    Zmień grupę
                                </vsud-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer"></div>
    </div>

    <div class="col-md-4" style="z-index: 10000">
        <!-- Modal -->
        <div
            class="modal modal-custom"
            tabindex="-1"
            role="dialog"
            ref="editModal"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edycja</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeEditModal()"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <label>Nazwa konta:</label>
                        <input
                            type="text"
                            placeholder="Nazwa konta"
                            name="name"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="userName"
                        />
                        <label>Hasło:</label>
                        <input
                            type="password"
                            placeholder="Hasło"
                            name="password"
                            class="form-control d-flex justify-content-start mb-3"
                            ref="userPassword"
                        />
                        <label>Uprawnienia:</label>
                        <select
                            class="form-control mb-3"
                            ref="selectedPermission"
                        >
                            <option v-for="perm in permissions" :value="perm">
                                {{ perm }}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeEditModal()"
                        >
                            Anuluj
                        </button>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="save()"
                        >
                            Zapisz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4" style="z-index: 10000">
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
                            ref="usureYesModal"
                        >
                            Tak
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4" style="z-index: 10001">
        <!-- Modal -->
        <div
            class="modal modal-custom"
            tabindex="-1"
            role="dialog"
            ref="cantModal"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            Nie można wykonać tej operacji
                        </h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeCantModal()"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        Próbujesz przypisać użytkownika do grupy, w której już
                        się znajduje
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeCantModal()"
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="col-md-4" style="z-index: 9999">
        <!-- Modal -->
        <div
            class="modal modal-custom"
            tabindex="-1"
            role="dialog"
            ref="showGroupsEdit"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edytuj grupy</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeGroupModal()"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="form-check">
                                <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-model="newGroup"
                                    ref="newGroupCheckbox"
                                    v-on:change="newGroupChanged"
                                />
                                <label class="custom-control-label"
                                    >Nowa grupa</label
                                >
                            </div>
                            <select class="form-control" ref="selectedGroup">
                                <option
                                    v-for="group in hubUserGroups.groups"
                                    :value="group"
                                >
                                    {{ group }}
                                </option>
                            </select>
                            <input
                                type="text"
                                class="form-control"
                                placeholder="Nazwa nowej grupy"
                                value=""
                                ref="inputGroupNameModal"
                            />
                        </div>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="addUserToGroup()"
                        >
                            Dodaj
                        </button>
                        <hr v-if="selectedUserGroups.groups?.length ?? 0 > 0" />
                        <div>
                            <div
                                class="d-flex"
                                style="list-style-type: none; font-size: 24px"
                                v-for="group in selectedUserGroups.groups"
                            >
                                <button
                                    class="btn btn-outline-danger"
                                    style="margin-right: 5px"
                                    @click="removeFromGroup(group)"
                                >
                                    Usuń
                                </button>
                                {{ group }}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeGroupModal()"
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
import VsudInput from "../Basic/VsudInput.vue";
import { useRouter } from "vue-router";
import TableSorter from "../../plugins/table-sorter";
import { useStore } from "vuex";
import { reactive, ref } from "@vue/reactivity";
import { computed, onMounted } from "@vue/runtime-core";
const store = useStore();

const router = useRouter();

const { hubs } = defineProps({
    hubs: Array,
});

const editModal = ref();
const userName = ref();
const userPassword = ref();
const permissions = ref();
const selectedPermission = ref();

const emit = defineEmits(["reload"]);

const tableSorter = new TableSorter(hubs);

const isAdmin = store.getters.getRole === "admin";
const loggedInUserVpnName = store.getters.getServer.getUser().name;
const reactiveUsers = reactive({ users: [] });

const date = computed(() => {
    return Date.now();
});

let currName = "";

const loading = reactive({inProgress: true});
// edit groups

const groups = reactive([]);
const showGroupsEdit = ref();
const newGroup = ref();
const newGroupCheckbox = ref();
const selectedGroup = ref();
const inputGroupNameModal = ref();
const selectedUserGroups = reactive({ groups: [] });
const cantModal = ref();
const usureModal = ref();
const usureYesModal = ref();
const hubUserGroups = reactive({ groups: [] });

let selectedGroupUser = null;

function openGroupModal(user) {
    selectedGroupUser = user;
    hubUserGroups.groups = user.hubGroups;
    selectedUserGroups.groups = user.group;
    showGroupsEdit.value.style.display = "block";
}

function closeGroupModal() {
    showGroupsEdit.value.style.display = "none";
}

function newGroupChanged() {
    selectedGroup.value.style.display = newGroupCheckbox.value.checked
        ? "none"
        : "block";
    inputGroupNameModal.value.style.display = newGroupCheckbox.value.checked
        ? "block"
        : "none";
}

async function addUserToGroup() {
    const user = selectedGroupUser;
    let vpnname = user.name;
    let groupName = "";
    if (newGroupCheckbox.value?.checked ?? true) {
        groupName = inputGroupNameModal.value.value;
        newGroupChanged();
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

    if (user.group.includes(groupName)) {
        cantModal.value.style.display = "block";
        return;
    }

    await store.getters.getServer.addUserToGroup(user.hub, groupName, vpnname);
    inputGroupNameModal.value.value = "";
    await refresh();
    await refreshUsers();
    openGroupModal(
        reactiveUsers.users.sortData.data.find(
            (e) => e.name === selectedGroupUser.name
        )
    );
}

async function removeFromGroup(group) {
    // are you sure
    usureModal.value.style.display = "block";
    const cl = async () => {
        closeUsureModal();
        await store.getters.getServer.removeFromSystemGroup(
            selectedGroupUser.hub,
            selectedGroupUser.name,
            group
        );
        usureYesModal.value.removeEventListener("click", cl);
        await refresh();
        await refreshUsers();
        openGroupModal(
            reactiveUsers.users.sortData.data.find(
                (e) => e.name === selectedGroupUser.name
            )
        );
    };
    usureYesModal.value.addEventListener("click", cl);
}

// end edit groups

function closeCantModal() {
    cantModal.value.style.display = "none";
}

async function closeUsureModal() {
    usureModal.value.style.display = "none";
}

function edit(name, username) {
    userName.value.value = username.replace(
        "@" + username.split("@").pop(),
        ""
    );
    currName = name;
    selectedPermission.value.value = reactiveUsers.users.sortData.data.find(
        (user) => {
            return user.name === name;
        }
    ).role;
    editModal.value.style.display = "block";
}

async function refreshUsers() {
    let hubUsers = [];

    let hubsList = [];

    try {
        let hubs = isAdmin
                ? await store.getters.getServer.listHubs()
                : await store.getters.getServer.listUserHubs(),
            id = 0;
        let fetchedHubs = hubs.data.listHubs
            ? hubs.data.listHubs
            : hubs.data.listUserHubs;
        fetchedHubs.HubList.forEach((hub) => {
            hubsList.push({
                name: hub.HubName_str,
                id: id++,
            });
        });

        for (let index in hubsList) {
            let users = await store.getters.getServer.listHubUsers(
                hubsList[index].name
            );

            let groups = (
                await store.getters.getServer.listSystemGroupsInHub(
                    hubsList[index].name
                )
            ).data.listSystemGroups;

            users.data.getHubUsers.forEach((userGroup) => {
                hubUsers.push({
                    name: userGroup.user.Name_str,
                    hub: hubsList[index].name,
                    role: userGroup.role,
                    username: userGroup.username,
                    group: userGroup.groups ? userGroup.groups : [],
                    hubGroups: groups,
                });
            });
        }

        reactiveUsers.users = new TableSorter(
            hubUsers.map((el, index) => {
                el.key = date + index;
                return el;
            })
        );
        loading.inProgress = false;
    } catch (e) {
        store.commit("setError", e);
        console.error(e);
    }
}

async function refresh() {
    let perms = await store.getters.getServer.getRoles();
    let userPerms = perms.data.getRoles;
    if (store.getters.getRole === "instructor") {
        userPerms.splice(userPerms.indexOf("admin"), 1);
    }
    permissions.value = userPerms;
}

async function save() {
    closeEditModal();
    try {
        let name = userName.value.value,
            password = userPassword.value.value,
            permission = "USER";

        if (name == null || name.trim() == "") {
            store.commit("setError", {
                message: "Nazwa użytkownika nie może być pusta",
            });
            return;
        }

        permission = selectedPermission.value.value.toUpperCase();
        await store.getters.getServer.updateUser(
            currName,
            name,
            password,
            permission
        );
        userName.value.value = "";
        userPassword.value.value = "";
        await refresh();
        await refreshUsers();
    } catch (e) {
        store.commit("setError", e);
    }
}

async function closeEditModal() {
    editModal.value.style.display = "none";
}

onMounted(async () => {
    await refresh();
    await refreshUsers();
    newGroupCheckbox.value.checked = (groups.value?.length ?? 0) == 0;
    newGroupChanged();
    selectedGroup.value.style.display =
        (groups.value?.length ?? 0) > 0
            ? selectedGroup.value.style.display
            : "none";
});
</script>
