<template>
    <div class="mb-4 card mw-fc ">
        <div class="card-header pb-0 d-flex justify-content-between">
            <h6>Ustawienia IPSec</h6>
            <div>
                <div
                    class="text-center shadow icon icon-shape border-radius-md bg-gradient-warning"
                >
                    <i
                        class="text-lg opacity-10 text-white fas fa-solid fa-wifi"
                        aria-hidden="true"
                    ></i>
                </div>
            </div>
        </div>
        <div class="p-3 card-body">
            <div class="d-flex flex-column justify-content-between">
                <div class="form-check d-flex justify-content-start mb-3">
                    <input
                        type="checkbox"
                        name="L2TP_Raw"
                        class="form-check-input"
                        ref="l2tpRaw"
                    />
                    <label class="form-check-label">
                        L2TP Raw
                    </label>
                </div>
                <div class="form-check d-flex justify-content-start mb-3">
                    <input
                        type="checkbox"
                        name="L2TP_IPsec"
                        class="form-check-input"
                        ref="l2tpIpsec"
                    />
                    <label class="form-check-label">
                        L2TP IPsec
                    </label>
                </div>
                <div class="form-check d-flex justify-content-start mb-3">
                    <input
                        type="checkbox"
                        name="EtherIp_IPsec"
                        class="form-check-input"
                        ref="etherIpIpsec"
                    />
                    <label class="form-check-label">
                        EtherIp IPsec
                    </label>
                </div>
                <label>Zmień hasło IPsec (puste by nie zmieniać)</label>
                <input
                    type="password"
                    placeholder="Hasło IPsec"
                    name="ipsecsecret"
                    class="form-control d-flex justify-content-start mb-3"
                    ref="ipsecSecret"
                    style="min-width:264px"
                />
                <label>Domyślny hub:</label>
                <select
                    class="form-control mb-3"
                    ref="selectHub"
                >
                    <option selected value="DEFAULT">DEFAULT</option>
                    <option
                        v-for="(name) in hubNames"
                        :value="name"
                    >
                        {{ name }}
                    </option>
                </select>
                <button
                    type="button"
                    class="btn bg-gradient-info"
                    @click="save()"
                >
                    Zapisz
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const hubNames = ref([]);
const selectHub = ref();
const l2tpRaw = ref();
const l2tpIpsec = ref();
const etherIpIpsec = ref();
const ipsecSecret = ref();

const updateData = async (ipsec = null)=>{
    try {
        let hubs = await store.getters.getServer.listHubs();
        hubs.data.listHubs.HubList.forEach((hub) => {
            hubNames.value.push(hub.HubName_str);
        });
        if(!ipsec){
            let ipsecGet = await store.getters.getServer.getIPsec()
            ipsec = ipsecGet.data.getIpSec;
        }

        l2tpRaw.value.checked = ipsec.L2TP_Raw_bool;
        l2tpIpsec.value.checked = ipsec.L2TP_IPsec_bool;
        etherIpIpsec.value.checked = ipsec.EtherIP_IPsec_bool;
        ipsecSecret.value.value = ipsec.IPsec_Secret_str;
        selectHub.value.value = ipsec.L2TP_DefaultHub_str;

    } catch (e) {
        store.commit("setError", e);
        console.error(e);
    }
}

onMounted(updateData());


function save() {
    try {
        let defaultHubName = selectHub.value.value,
            l2tpRawValue = false,
            l2tpIpsecValue = false,
            etherIpIpsecValue = false,
            ipsecSecretValue = "";
        
        // defaultHubName = hubNames.value[selectHub.value.value - 1];
        l2tpRawValue = l2tpRaw.value.checked;
        l2tpIpsecValue = l2tpIpsec.value.checked;
        etherIpIpsecValue = etherIpIpsec.value.checked;
        ipsecSecretValue = ipsecSecret.value.value;

        console.log({ s:selectHub.value.value,defaultHub: defaultHubName, l2tpRaw: l2tpRawValue, l2tpIpsec: l2tpIpsecValue, etherIpIpsec: etherIpIpsecValue, ipsecSecret: ipsecSecretValue })

        store.getters.getServer
            .setIPsec(l2tpRawValue, l2tpIpsecValue, etherIpIpsecValue, ipsecSecretValue, defaultHubName)
            .then(async (ipsec) => {
                await updateData(ipsec.data.setIpSec);
                store.commit("showAlert", { message: "Zapisano!" });
            })
            .catch((e) => {
                store.commit("setError", e);
                console.error(e);
            });
    } catch (e) {
        store.commit("setError", e);
        console.error(e);
    }
}
</script>
