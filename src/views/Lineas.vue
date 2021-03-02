<template>
  <div v-if="!loading">
    <h1>Líneas</h1>
    <div>
      <input
        v-model="searchQuery"
        class="input w100 lineas-search"
        type="search"
        name="search"
        placeholder="Buscar..."
      >
    </div>
    <lineas-item
      v-for="linea of filteredLineas"
      :key="linea._id"
      :linea="linea"
      :nucleos="getNucleosNames(linea.nucleosIda)"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import { useStore } from 'vuex';
import LineasItem from '@/components/LineasItem.vue';
import ApiLineas from '@/lib/ApiLineas';
import ApiNucleos from '@/lib/ApiNucleos';
import { ApiLinea, ApiNucleo } from '@/interfaces/apiResponses';

export default defineComponent({
  name: 'Lineas',
  components: {
    LineasItem,
  },

  setup() {
    const lineas = ref<ApiLinea[]>([]);
    const nucleos = ref<ApiNucleo[]>([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const apiLineas = ApiLineas;
    const apiNucleos = ApiNucleos;
    const store = useStore();

    const urlBase = computed(() => store.state.urlBase);

    const filteredLineas = computed(() => {
      const value = searchQuery.value.trim().toUpperCase();
      if (value === '') return lineas.value;

      const filtered: ApiLinea[] = [];

      // Buscar coincidencias en destinos
      lineas.value.forEach(linea => {
        if (!linea.nucleosInfo) return;
        if (linea.nucleosInfo.some(n => n.name.includes(value))) {
          filtered.push(linea);
        }
      });

      // Buscar coincidencias en paradas
      const restantes = lineas.value.filter(l => !filtered.includes(l));
      restantes.forEach(linea => {
        if (!linea.paradasInfo) return;
        if (linea.paradasInfo.some(p => p.name.includes(value))) {
          filtered.push(linea);
        }
      });

      return filtered;
    });

    const getNucleosNames = (nucleosIds: string[]): string[] => {
      if (!nucleosIds) { return []; }
      const nucleosNames: string[] = [];

      nucleosIds.forEach(nucleo => {
        const val = nucleos.value.find(n => n._id === nucleo);

        if (!val) return;
        nucleosNames.push(val.name);
      });

      return nucleosNames;
    };

    onMounted(async () => {
      try {
        const nucleosResponse = await apiNucleos.getNucleos();
        nucleos.value = nucleosResponse;

        const lineasResponse = await apiLineas.getLineas();
        lineas.value = lineasResponse;
        loading.value = false;
      } catch (error) {
        console.log(error);
      }
    });

    return {
      urlBase,
      lineas,
      nucleos,
      loading,
      searchQuery,
      filteredLineas,
      getNucleosNames,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.lineas-search {
    padding: 12px 16px;
}
</style>