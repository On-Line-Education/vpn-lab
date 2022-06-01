<template>
  <div class="mb-4 card full-width">
    <div class="p-3 card-body flex-space-between">
      <div class="d-flex flex-row-reverse justify-content-between">
        <h5 class="mb-0 font-weight-bolder">
          {{ name }}
        </h5>
      </div>
      <div>
        <button @click="download" class="btn bg-gradient-info">Pobierz</button>
        <button v-if="isAdmin" class="btn bg-gradient-danger" @click="del">
          Usuń
        </button>
      </div>
    </div>
  </div>

  <!-- dir-button-name="Przejdź"
                dir-button-vaiant="gradient"
                dir-button-color="success" -->
</template>



<script setup>
import VsudInput from "../Basic/VsudInput.vue";
import VsudButton from "../Basic/VsudButton.vue";
import { useStore } from "vuex";
import { ref } from "vue";
const store = useStore();

const { id, name, path, isAdmin } = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["reload"]);

function download() {
  fetch(path)
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.style = "display: none";

      if (name && name.length) a.download = name;
      document.body.appendChild(a);
      a.click();
    })
    .catch((e) => store.commit("setError", e));
}

async function del() {
  await store.getters.getServer.deleteFile(id);
  emit('reload');
}
</script>
