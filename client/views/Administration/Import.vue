<template>
    <div class="mb-4 card mw-fc">
        <div class="card-header pb-0 d-flex justify-content-between">
            <h6>Import Użytkowników</h6>
            <div>
                <div
                    class="text-center shadow icon icon-shape border-radius-md bg-gradient-warning"
                >
                    <i
                        class="text-lg opacity-10 text-white fas fa-solid fa-users"
                        aria-hidden="true"
                    ></i>
                </div>
            </div>
        </div>
        <div class="p-3 card-body">
            <div class="d-flex flex-column justify-content-between">
                <select
                    class="form-control mb-3"
                    ref="selectHub"
                    @change="selectHubChanged"
                >
                    <option selected value="0" v-if="isAdmin">Nowy Hub</option>
                    <option
                        v-for="(name, index) in hubNames"
                        :value="index + 1"
                    >
                        {{ name }}
                    </option>
                </select>
                <input
                    type="text"
                    placeholder="Nazwa huba"
                    name="hubname"
                    class="form-control d-flex justify-content-start mb-3"
                    ref="customHubName"
                    :disabled="disableCustomHubName"
                    v-if="isAdmin"
                />
                <input
                    titleColor="opacity-7"
                    iconClass="text-white fas fa-solid fa-users"
                    iconBackground="bg-gradient-warning"
                    buttonName="Importuj"
                    type="file"
                    class="form-control mb-3"
                    buttonVaiant="gradient"
                    ref="file"
                    accept=".csv"
                    @change="newFile()"
                />
                <button
                    type="button"
                    class="btn bg-gradient-info"
                    ref="importButton"
                    @click="importData()"
                >
                    Importuj
                </button>
            </div>
        </div>
    </div>

    <div class="mb-4 card mw-fc" v-if="csvData.csv != null">
        <div class="card-header pb-0 d-flex justify-content-between">
            <h6>Podgląd importu</h6>
            <div>
                <div
                    class="text-center shadow icon icon-shape border-radius-md bg-gradient-info"
                >
                    <i
                        class="text-lg opacity-10 text-white fas fa-solid fa-magnifying-glass"
                        aria-hidden="true"
                    ></i>
                </div>
            </div>
        </div>
        <div
            class="card-body p-3 d-flex justify-content-between table-responsive"
        >
            <table class="table align-items-center mb-0">
                <thead>
                    <tr class="table-ms-15">
                        <th v-for="title in previewTitles">{{ title }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-ms-15" v-for="data in previewData">
                        <td v-for="val in data">{{ val }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import * as CSV from "papaparse";
import { useStore } from "vuex";

const store = useStore();
const file = ref();
const csvData = reactive({ csv: null });
const previewTitles = ref([]);
const previewData = ref([]);
const hubNames = ref([]);
const selectHub = ref();
const disableCustomHubName = ref(false);
const customHubName = ref();
const importButton = ref();

const isAdmin = store.getters.getRole == "admin";

function selectHubChanged() {
    if (selectHub.value.value != 0) {
        disableCustomHubName.value = true;
    } else {
        disableCustomHubName.value = false;
    }
}

onMounted(async () => {
    try {
        let hubs = [];
        if (isAdmin) {
            hubs = (await store.getters.getServer.listHubs()).data.listHubs
                .HubList;
        } else {
            hubs = (
                await store.getters.getServer.listUserHubs(
                    store.getters.getServer.getUser().name
                )
            ).data.listUserHubs.HubList;
        }

        hubs.forEach((hub) => {
            hubNames.value.push(hub.HubName_str);
        });
    } catch (e) {
        store.commit("setError", e);
        console.error(e);
    }
});

watch(file, (newData, _) => {
    if (newData.files.length > 0) returnValue(newData.files);
});

function newFile() {
    if (file.value.files.length > 0) returnValue(file.value.files);
}

function clearImport() {
    csvData.csv = null;
    file.value.value = null;
    previewTitles.value = [];
    previewData.value = [];
}

function returnValue(val) {
    var fReader = new FileReader();
    fReader.readAsText(val[0]);
    fReader.onloadend = function (event) {
        try {
            csvData.csv = CSV.parse(event.target.result.trim(), {
                output: "objects",
            });

            if (csvData.csv.errors.length > 0) {
                clearImport();
                throw new Error("Nieprawidłowy plik csv");
            }

            let invalid = false;
            csvData.csv.data.forEach((row, index) => {
                if (invalid) {
                    return;
                }
                if (index == 0) {
                    let titles = [];
                    row.forEach((element) => {
                        previewTitles.value.push(element);
                    });
                    if (previewTitles.value.length != 5) {
                        clearImport();
                        invalid = true;
                        throw new Error("Nieprawidłowa struktura pliku csv");
                    }
                    let csvRequiredTitles = [
                        "name",
                        "username",
                        "role",
                        "password",
                        "passcode",
                    ];
                    for (let index in csvRequiredTitles) {
                        if (
                            !previewTitles.value.includes(
                                csvRequiredTitles[index]
                            )
                        ) {
                            clearImport();
                            invalid = true;
                            throw new Error(
                                "Nieprawidłowa struktura pliku csv"
                            );
                        }
                    }
                    previewTitles.value.push(...titles);
                    return;
                }
                let data = [];
                row.forEach((element) => {
                    data.push(element);
                });
                previewData.value.push(data);
            });
        } catch (e) {
            store.commit("setError", e);
            console.error(e);
        }
    };
}

function importData() {
    try {
        importButton.value.disabled = true;
        let hubName = "",
            newHub = false,
            csv = [];
        if (selectHub.value.value != 0) {
            hubName = hubNames.value[selectHub.value.value - 1];
        } else {
            hubName = customHubName.value.value;
            newHub = true;
        }
        let titles = [];
        previewTitles.value.forEach((name, index) => {
            titles.push({ name, index });
        });
        previewData.value.forEach((row) => {
            let obj = {};
            titles.forEach((title) => {
                obj[title.name] = row[title.index];
            });
            csv.push(obj);
        });
        store.getters.getServer
            .import({ csv, newHub, hubName })
            .then((_) => {
                importButton.value.disabled = false;
                store.commit("showAlert", { message: "Import zakończony" });
            })
            .catch((e) => {
                importButton.value.disabled = false;
                store.commit("setError", e);
                console.error(e);
            });
    } catch (e) {
        importButton.value.disabled = false;
        store.commit("setError", e);
        console.error(e);
    }
}
</script>
