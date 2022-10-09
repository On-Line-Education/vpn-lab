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
        <div class="card-header pb-0 flex-space-between">
            <h6>Lista Użytkowników</h6>
            <vsud-input
                type="text"
                placeholder="Szukaj"
                name="search"
                size="sm"
                @keyup="reactiveHub.hub.search($event.target.value)"
            ></vsud-input>
            <vsud-button
                color="info"
                variant="outline"
                size="sm"
                @click="bulkAddToGroup()"
                v-if="isInstructor"
            >
                Zmień grupę wybranym użytkownikom
            </vsud-button>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                            >
                                <input
                                    type="checkbox"
                                    ref="selectAll"
                                    v-on:change="selectAllUsers()"
                                />
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="reactiveHub.hub.sort('username')"
                            >
                                Nazwa użytkownika
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2"
                                @click="reactiveHub.hub.sort('group')"
                            >
                                Grupa
                            </th>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2"
                                @click="reactiveHub.hub.sort('role')"
                            >
                                Rola
                            </th>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                            >
                                Działania
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="user in reactiveHub.hub.sortData.data"
                            :key="user.key"
                        >
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                    >
                                        <input
                                            type="checkbox"
                                            name="selected"
                                            :checked="user.selected"
                                            v-on:change="
                                                changeUserSelected(user)
                                            "
                                        />
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
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                    >
                                        <h6 class="mb-0 text-sm">
                                            {{ user.role }}
                                        </h6>
                                    </div>
                                </div>
                            </td>
                            <td class="align-middle">
                                <vsud-button
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                    @click="changeGroups(user.name)"
                                    v-if="isInstructor"
                                >
                                    Edytuj grupy
                                </vsud-button>
                                <vsud-button
                                    color="danger"
                                    variant="outline"
                                    size="sm"
                                    @click="deleteUser(user.name)"
                                    v-if="
                                        isInstructor &&
                                        ((user.role.toUpperCase() ===
                                            'INSTRUCTOR' &&
                                            instructorsCount > 1) ||
                                            user.role.toUpperCase() === 'USER')
                                    "
                                >
                                    Usuń
                                </vsud-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="d-flex" v-if="isInstructor">
        <div class="mb-4 card full-width">
            <div class="p-3 card-body flex-space-between">
                <div class="d-flex flex-row-reverse justify-content-between">
                    <div class="numbers">
                        <h3
                            class="tooltip-custom"
                            data-html="true"
                            data-toggle="tooltip"
                            data-placement="bottom"
                            title="W celu prostrzego odróżnienia nazw użytkowników w systemie, zostaną one poprzedzone przedrostkiem z budowanym z nazwy huba oraz znaku podkreślenia"
                        >
                            Dodaj konto
                        </h3>
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
                        <div v-if="isAdmin">
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
                </div>
                <vsud-button variant="gradient" color="success" @click="addUser"
                    >Dodaj</vsud-button
                >
            </div>
        </div>
    </div>

    <div class="col-md-4">
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
                            @click="closeModal"
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
                                    :disabled="(groups.value?.length ?? 0) == 0"
                                    ref="newGroupCheckbox"
                                    v-on:change="newGroupChanged"
                                />
                                <label class="custom-control-label"
                                    >Nowa grupa</label
                                >
                            </div>
                            <select class="form-control" ref="selectedGroup">
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
                                placeholder="Nazwa nowej grupy"
                                value=""
                                ref="inputGroupNameModal"
                            />
                        </div>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="addUserToGroup"
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
                                    @click="
                                        removeFromGroup(
                                            selectedUser.vpnname,
                                            group
                                        )
                                    "
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
                            @click="closeModal"
                        >
                            Zamknij
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

    <div class="col-md-4">
        <!-- Modal -->
        <div
            class="modal modal-custom"
            tabindex="-1"
            role="dialog"
            ref="showGroupsBulkEdit"
        >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edytuj grupy</h5>
                        <button
                            type="button"
                            class="btn-close text-dark"
                            @click="closeBulkModal"
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
                                    v-model="newBulkGroup"
                                    ref="newGroupBulkCheckbox"
                                    v-on:change="newGroupBulkChanged"
                                />
                                <label class="custom-control-label"
                                    >Nowa grupa</label
                                >
                            </div>
                            <select
                                class="form-control"
                                ref="selectedBulkGroup"
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
                                placeholder="Nazwa nowej grupy"
                                value=""
                                ref="inputGroupNameBulkModal"
                            />
                        </div>
                        <button
                            type="button"
                            class="btn bg-gradient-primary"
                            @click="addUsersToGroup()"
                        >
                            Dodaj
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn bg-gradient-secondary"
                            @click="closeBulkModal"
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
import VsudInput from "../Basic/VsudInput.vue";
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

const isAdmin = store.getters.getRole == "admin";
const isInstructor = isAdmin || store.getters.getRole == "instructor";
const permissions = ref();
const selectedPermission = ref();

const selectAll = ref();

const groups = reactive([]);
const newGroup = ref();
const newGroupCheckbox = ref();
const selectedGroup = ref();
const inputGroupModal = ref();
const inputGroupNameModal = ref();
const inputGroupDoneModal = ref();

const showGroupsEdit = ref();
const selectedUserGroups = reactive({ groups: [] });
const selectedUser = reactive({ vpnname: "" });

const userName = ref();
const userPassword = ref();

const cantModal = ref();

const usureModal = ref();
const usureYesModal = ref();

// bulk group edit vars
const showGroupsBulkEdit = ref();
const newBulkGroup = ref();
const newGroupBulkCheckbox = ref();
const selectedBulkGroup = ref();
const inputGroupNameBulkModal = ref();
// end bulk group edit vars

var reactiveHub = reactive({ hub: [] });

const date = computed(() => {
    return Date.now();
});

const instructorsCount = computed(() => {
    return reactiveHub.hub.sortData.data.filter((el) => {
        return el.role.toUpperCase() === "INSTRUCTOR";
    }).length;
});

function closeCantModal() {
    cantModal.value.style.display = "none";
}

function newGroupChanged() {
    selectedGroup.value.style.display = newGroupCheckbox.value.checked
        ? "none"
        : "block";
    inputGroupNameModal.value.style.display = newGroupCheckbox.value.checked
        ? "block"
        : "none";
}

async function addUser() {
    let username = userName.value.value,
        password = userPassword.value.value,
        permission = "USER";

    if (username == null || username.trim() == "") {
        store.commit("setError", {
            message: "Należy podać nazwę użytkownika",
        });
        return;
    }
    if (password == null || password.trim() == "") {
        store.commit("setError", {
            message: "Należy podać hasło dla konta użytkownika",
        });
        return;
    }

    if (isAdmin) {
        permission = selectedPermission.value.value.toUpperCase();
    }

    await store.getters.getServer.createUser(
        hubname,
        username,
        password,
        permission
    );
    userName.value.value = "";
    userPassword.value.value = "";
    await refresh();
    await refreshUsers();
}

async function deleteUser(username) {
    usureModal.value.style.display = "block";
    const cl = async () => {
        closeUsureModal();
        await store.getters.getServer.deleteUser(hubname, username);
        usureYesModal.value.removeEventListener("click", cl);
        await refresh();
        await refreshUsers();
    };
    usureYesModal.value.addEventListener("click", cl);
}

function updateGroupData() {
    let vpnname = selectedUser.vpnname;
    if (vpnname == null || vpnname.trim() == "") {
        return;
    }
    selectedUserGroups.groups = reactiveHub.hub.sortData.data.find((e) => {
        return e.name == vpnname;
    }).group;
}

async function changeGroups(vpnname) {
    selectedUser.vpnname = vpnname;
    updateGroupData();

    showGroupsEdit.value.style.display = "block";
}

async function refreshUsers() {
    let hubUsers = [];
    let users = await store.getters.getServer.listHubUsers(hubname);
    users.data.getHubUsers.forEach((userGroup) => {
        hubUsers.push({
            name: userGroup.user.Name_str,
            group: userGroup.groups ? userGroup.groups : [],
            role: userGroup.role,
            username: userGroup.username,
            selected: false,
        });
    });
    reactiveHub.hub = new TableSorter(
        hubUsers.map((el, index) => {
            el.key = date + index;
            return el;
        })
    );
    updateGroupData();
    try {
        selectAll.value.checked = false;
    } catch (e) {
        //do nothing
    }
}

async function refresh() {
    groups.value = (
        await store.getters.getServer.listSystemGroupsInHub(hubname)
    ).data.listSystemGroups;
    let perms = await store.getters.getServer.getRoles();
    let userPerms = perms.data.getRoles;
    if (store.getters.getRole == "instructor") {
        userPerms.splice(userPerms.indexOf("admin"), 1);
    }
    permissions.value = userPerms;
}

async function addUserToGroup() {
    let vpnname = selectedUser.vpnname;
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

    if (selectedUserGroups.groups.includes(groupName)) {
        cantModal.value.style.display = "block";
        return;
    }

    await store.getters.getServer.addUserToGroup(hubname, groupName, vpnname);
    inputGroupNameModal.value.value = "";
    await refresh();
    await refreshUsers();
}

onMounted(async () => {
    await refresh();
    await refreshUsers();
    newGroupCheckbox.value.checked = (groups.value?.length ?? 0) == 0;
    newGroupBulkCheckbox.value.checked = (groups.value?.length ?? 0) == 0;
    newGroupChanged();
    newGroupBulkChanged();
    selectedGroup.value.style.display =
        (groups.value?.length ?? 0) > 0
            ? selectedGroup.value.style.display
            : "none";
    selectedBulkGroup.value.style.display = !newGroupBulkCheckbox.value.checked
        ? selectedBulkGroup.value.style.display
        : "none";
});

function closeModal() {
    showGroupsEdit.value.style.display = "none";
}

async function closeUsureModal() {
    usureModal.value.style.display = "none";
}

function addToGroup(vpnname) {
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
            vpnname
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
        await store.getters.getServer.removeFromSystemGroup(
            hubname,
            username,
            group
        );
        usureYesModal.value.removeEventListener("click", cl);
        await refreshUsers();
    };
    usureYesModal.value.addEventListener("click", cl);
}

function changeGroup(vpnname) {
    addToGroup(vpnname);
}

function selectAllUsers() {
    if (reactiveHub.hub.sortData.data.length == 0) {
        return;
    }
    const check = selectAll.value.checked;
    for (let index in reactiveHub.hub.sortData.data) {
        reactiveHub.hub.sortData.data[index].selected = check;
    }
}

function changeUserSelected(user) {
    reactiveHub.hub.sortData.data[
        reactiveHub.hub.sortData.data.indexOf(user)
    ].selected = !user.selected;
    let selected = 0;
    reactiveHub.hub.sortData.data.forEach((e) => {
        if (e.selected) {
            selected++;
        }
    });

    if (selected > 0 && selected != reactiveHub.hub.sortData.data.length) {
        selectAll.value.indeterminate = true;
    } else if (selected == 0) {
        selectAll.value.indeterminate = false;
        selectAll.value.checked = false;
    } else {
        selectAll.value.indeterminate = false;
        selectAll.value.checked = true;
    }
}

// bulk add to group

function bulkAddToGroup() {
    showGroupsBulkEdit.value.style.display = "block";
}

function closeBulkModal() {
    showGroupsBulkEdit.value.style.display = "none";
}

function newGroupBulkChanged() {
    selectedBulkGroup.value.style.display = newGroupBulkCheckbox.value.checked
        ? "none"
        : "block";
    inputGroupNameBulkModal.value.style.display = newGroupBulkCheckbox.value
        .checked
        ? "block"
        : "none";
}

async function addUsersToGroup() {
    let groupName = "";
    if (newGroupBulkCheckbox.value?.checked ?? true) {
        groupName = inputGroupNameBulkModal.value.value;
        newGroupChanged();
    } else {
        if (selectedBulkGroup.value.value) {
            groupName = selectedBulkGroup.value.value;
        } else {
            store.commit("setError", {
                message: "Wystąpił błąd podczas określania grupy",
            });
            return;
        }
    }

    if (selectedUserGroups.groups.includes(groupName)) {
        cantModal.value.style.display = "block";
        return;
    }

    const usersToGroupAdd = [];
    for (let index in reactiveHub.hub.sortData.data) {
        if (!reactiveHub.hub.sortData.data[index].selected) {
            continue;
        }
        if (!reactiveHub.hub.sortData.data[index].group.includes(groupName)) {
            usersToGroupAdd.push(reactiveHub.hub.sortData.data[index].name);
        }
    }

    for (let index in usersToGroupAdd) {
        await store.getters.getServer.addUserToGroup(
            hubname,
            groupName,
            usersToGroupAdd[index]
        );
    }

    inputGroupNameBulkModal.value.value = "";
    await refresh();
    await refreshUsers();
}

// end bulk add to group
</script>
