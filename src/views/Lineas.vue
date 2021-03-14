<template>
  <div v-if="!loading" class="linea position-relative">
    <h1>Líneas</h1>
    <ui-input
      v-model:value="searchQuery"
      :type="'search'"
      :name="'search'"
      :placeholder="'Buscar...'"
    />
    <transition-group name="linea-card">
      <lineas-item
        v-for="linea of filteredLineas"
        :key="linea._id"
        :linea="linea"
        :nucleos="getNucleosNames(linea.nucleosIda)"
      />
    </transition-group>
  </div>

  <component
    :is="alertComponent"
    :show="showAlertBox"
    @ok="closeAlert"
    @cancel="closeAlert"
  />

  <ui-loading :loading="loading" text="Cargando líneas..." />
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import { useStore } from '@/store';
import UiLoading from '@/components/ui/UiLoading.vue';
import UiInput from '@/components/ui/UiInput.vue';
import LineasItem from '@/components/LineasItem.vue';
import ApiLineas from '@/lib/ApiLineas';
import ApiNucleos from '@/lib/ApiNucleos';
import AlertBox from '@/composables/alertBox';

export default defineComponent({
  name: 'Lineas',
  components: {
    UiLoading,
    UiInput,
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

    const {
      openAlert, closeAlert, alertComponent, showAlertBox,
    } = AlertBox();

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
      } catch (error) {
        openAlert({
          title: 'Error',
          message: 'Ha ocurrido un error obteniendo los datos de las líneas',
        });
        console.log(error);
      } finally {
        loading.value = false;
      }
    });

    return {
      store,
      lineas,
      nucleos,
      loading,
      searchQuery,
      filteredLineas,
      getNucleosNames,
      openAlert,
      closeAlert,
      showAlertBox,
      alertComponent,
    };
  },
});
</script>
