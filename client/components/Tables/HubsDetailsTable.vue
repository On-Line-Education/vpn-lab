<template>
    <div class="card mb-4">
        <div class="card-header pb-0">
            <h6>Lista Użytkowników</h6>
        </div>
        <div class="card-body px-0 pt-0 pb-2">
            <div class="table-responsive p-0">
                <table v-if="hub != null" class="table align-items-center mb-0">
                    <thead>
                        <tr>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Nazwa użytkownika
                            </th>
                            <th
                                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                            >
                                Grupa
                            </th>
                            <th
                                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
                            >
                                Status
                            </th>
                            <th class="text-secondary opacity-7"></th>
                        </tr>
                    </thead>
                    <tbody v-for="user in hub">
                        <tr>
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
                                <p class="text-xs font-weight-bold mb-0">
                                    {{ user.group }}
                                </p>
                            </td>
                            <td class="align-middle text-center text-sm">
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
                            </td>
                            <td class="align-middle">
                                <a
                                    href="javascript:;"
                                    class="text-secondary font-weight-bold text-xs"
                                    data-toggle="tooltip"
                                    data-original-title="Zobacz więcej"
                                    >TODO</a
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

const { hub } = defineProps({
    hub: Array,
});
</script>
