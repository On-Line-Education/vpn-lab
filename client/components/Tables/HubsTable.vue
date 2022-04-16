<template>
    <div class="card mb-4">
        <div class="card-header pb-0">
            <h6>Lista HUBów</h6>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
                <table class="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Nazwa
                            </th>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                            >
                                Szkoła
                            </th>
                            <th
                                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Status
                            </th>
                            <th class="text-secondary opacity-7"></th>
                        </tr>
                    </thead>
                    <tbody v-for="hub in hubs">
                        <tr>
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
                                <a
                                    href="javascript:;"
                                    class="text-secondary font-weight-bold text-xs"
                                    data-toggle="tooltip"
                                    data-original-title="Zobacz szczegóły"
                                    >Szczegóły</a
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import VsudAvatar from "../Basic/VsudAvatar.vue";
import VsudBadge from "../Basic/VsudBadge.vue";

const hubs = [
    { name: "Aaa", school: "Wiszniowa", status: "Działa", working: true },
    { name: "Bbb", school: "Wuwsi", status: "Offline", working: false },
];
</script>
