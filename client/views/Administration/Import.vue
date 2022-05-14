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
                <select class="form-control mb-3"></select>
                <input
                    type="text"
                    placeholder="Nazwa huba"
                    name="hubname"
                    class="form-control d-flex justify-content-start mb-3"
                    @keyup="hubname($event.target.value)"
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
                    @change="newFile()"
                />
                <button
                    type="button"
                    class="btn bg-gradient-info"
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
                <tr class="table-ms-15">
                    <th v-for="title in previewTitles">{{ title }}</th>
                </tr>
                <tr class="table-ms-15" v-for="data in previewData">
                    <td v-for="val in data">{{ val }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, watch } from "vue";
import * as CSV from "papaparse";
import { useStore } from "vuex";

const store = useStore();
const file = ref();
const csvData = reactive({ csv: null });
const previewTitles = ref([]);
const previewData = ref([]);

watch(file, (newData, _) => {
    console.dir(newData);
    console.dir(newData.files[0]);
    if (newData.files.length > 0) returnValue(newData.files);
});

function newFile() {
    console.dir(file.value.files[0]);
    if (file.value.files.length > 0) returnValue(file.value.files);
}

function clearImport() {
    csvData.csv = null;
    file.value.value = null;
    previewTitles.value = [];
    previewData.value = [];
}

function returnValue(val) {
    console.log(val[0]);
    var fReader = new FileReader();
    fReader.readAsText(val[0]);
    fReader.onloadend = function (event) {
        csvData.csv = CSV.parse(event.target.result, {
            output: "objects",
        });
        console.log(csvData.csv.data);
        // console.table(csvData.csv.data);
        console.log(csvData.csv.errors);

        if (csvData.csv.errors.length > 0) {
            store.commit("setError", { message: "Nieprawidłowy plik csv" });
            clearImport();
            return;
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
                if (previewTitles.value.length != 2) {
                    store.commit("setError", {
                        message: "Nieprawidłowa struktura pliku csv",
                    });
                    clearImport();
                    invalid = true;
                }
                let csvRequiredTitles = ["name", "role"];
                for (let index in csvRequiredTitles) {
                    if (
                        !previewTitles.value.includes(csvRequiredTitles[index])
                    ) {
                        store.commit("setError", {
                            message: "Nieprawidłowa struktura pliku csv",
                        });
                        clearImport();
                        invalid = true;
                        return;
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
    };
}

function importData() {}
</script>
