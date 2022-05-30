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
                                class="text-uppercase text-secondary font-weight-bolder opacity-7 ps-2"
                                @click="tableSorter.sort('school')"
                            >
                                Szkoła
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
                            <td>
                                <p class="text-xs font-weight-bold mb-0">
                                    {{ hub.school }}
                                </p>
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
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="card-footer"></div>
    </div>
</template>

<script setup>
import VsudAvatar from "../Basic/VsudAvatar.vue";
import VsudBadge from "../Basic/VsudBadge.vue";
import VsudButton from "../Basic/VsudButton.vue";
import VsudInput from "../Basic/VsudInput.vue";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import TableSorter from "../../plugins/table-sorter";

const router = useRouter();

const { hubs } = defineProps({
    hubs: Array,
});

const tableSorter = new TableSorter(hubs);

function more(hubname) {
    router.push({ name: "HUB", params: { hubname } });
}
</script>