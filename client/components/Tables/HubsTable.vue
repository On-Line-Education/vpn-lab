<template>
    <div class="card mb-4">
        <div class="card-header pb-0 flex-space-between">
            <h6>Lista HUBów</h6>
            <vsud-input
                type="text"
                placeholder="Szukaj"
                name="search"
                size="sm"
                @keyup="tableSorter.search($event.target.value)"
            ></vsud-input>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
                <table
                    v-if="hubs != null"
                    class="table align-items-center mb-0 sortable"
                >
                    <thead>
                        <tr>
                            <th
                                class="text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="tableSorter.sort('name')"
                            >
                                Nazwa
                            </th>
                            <th
                                class="text-center text-uppercase text-secondary font-weight-bolder opacity-7"
                                @click="tableSorter.sort('status')"
                            >
                                Status
                            </th>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Działania
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="hub in tableSorter.sortData.data">
                            <td>
                                <div class="d-flex px-2 py-1">
                                    <div
                                        class="d-flex flex-column justify-content-center"
                                    >
                                        <h6 class="mb-0 text-sm">
                                            {{ hub.name }}
                                        </h6>
                                    </div>
                                </div>
                            </td>
                            <td class="align-middle text-center text-sm">
                                <vsud-badge
                                    v-if="hub.working"
                                    color="success"
                                    variant="gradient"
                                    size="sm"
                                    >{{ hub.status }}</vsud-badge
                                >
                                <vsud-badge
                                    v-else
                                    color="secondary"
                                    variant="gradient"
                                    size="sm"
                                    >{{ hub.status }}</vsud-badge
                                >
                            </td>
                            <td class="align-middle">
                                <vsud-button
                                    @click="more(hub.name)"
                                    color="info"
                                    variant="outline"
                                    size="sm"
                                >
                                    Więcej
                                </vsud-button>
                                <vsud-button
                                    @click="del(hub.name)"
                                    color="danger"
                                    variant="outline"
                                    size="sm"
                                    v-if="isAdmin"
                                >
                                    Usuń
                                </vsud-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer"></div>
    </div>

    <div class="col-md-4" style="z-index: 10">
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
</template>

<script setup>
import VsudAvatar from "../Basic/VsudAvatar.vue";
import VsudBadge from "../Basic/VsudBadge.vue";
import VsudButton from "../Basic/VsudButton.vue";
import VsudInput from "../Basic/VsudInput.vue";
import { useRouter } from "vue-router";
import TableSorter from "../../plugins/table-sorter";
import { useStore } from "vuex";
import { ref } from "@vue/reactivity";
const store = useStore();

const router = useRouter();

const { hubs } = defineProps({
    hubs: Array,
});

const usureModal = ref();

const emit = defineEmits(["reload"]);

const tableSorter = new TableSorter(hubs);

const isAdmin = store.getters.getRole == "admin";

function more(hubname) {
    router.push({ name: "HUB", params: { hubname } });
}

async function del(hubname) {
    usureModal.value.style.display = "block";
    const cl = async () => {
        closeUsureModal();
        try {
            let users = (await store.getters.getServer.listHubUsers(hubname))
                .data.getHubUsers;

            // delete all users
            for (let index in users) {
                console.log(users[index].user.Name_str);
                await store.getters.getServer.deleteUser(
                    hubname,
                    users[index].user.Name_str
                );
            }

            await store.getters.getServer.deleteHub(hubname);
            usureModal.value.removeEventListener("click", cl);
            emit("reload");
        } catch (e) {
            store.commit("setError", e);
            return;
        }
    };
    usureModal.value.addEventListener("click", cl);
}

async function closeUsureModal() {
    usureModal.value.style.display = "none";
}
</script>
