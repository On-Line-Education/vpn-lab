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
                            <td class="align-middle">
                                <vsud-button
                                    @click="edit(user.name, user.username)"
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                >
                                    Edytuj
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
</template>

<script setup>
import VsudAvatar from "../Basic/VsudAvatar.vue";
import VsudBadge from "../Basic/VsudBadge.vue";
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

const isAdmin = store.getters.getRole == "admin";

var reactiveUsers = reactive({ users: [] });

const date = computed(() => {
    return Date.now();
});

let currName = "";

function edit(name, username) {
    userName.value.value = username;
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

            users.data.getHubUsers.forEach((userGroup) => {
                hubUsers.push({
                    name: userGroup.user.Name_str,
                    hub: hubsList[index].name,
                    role: userGroup.role,
                    username: userGroup.username,
                });
            });
        }

        reactiveUsers.users = new TableSorter(
            hubUsers.map((el, index) => {
                el.key = date + index;
                return el;
            })
        );
    } catch (e) {
        store.commit("setError", e);
        console.error(e);
    }
}

async function refresh() {
    let perms = await store.getters.getServer.getRoles();
    let userPerms = perms.data.getRoles;
    if (store.getters.getRole == "instructor") {
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
                message: "Nazwa użytkownika nie moiże być pusta",
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
        return;
    }
}

async function closeEditModal() {
    editModal.value.style.display = "none";
}

onMounted(async () => {
    await refresh();
    await refreshUsers();
});
</script>
