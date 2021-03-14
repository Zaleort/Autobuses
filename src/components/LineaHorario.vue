<template>
  <div v-if="showHorario">
    <h2 :id="tipoHorario">
      Horarios de {{ tipoHorario }}
      <ui-icon
        v-if="verHorarios"
        class="clickable"
        icon="minus"
        size="mini"
        @click="toggleHorario"
      />
      <ui-icon
        v-else
        class="clickable"
        icon="plus"
        size="mini"
        @click="toggleHorario"
      />
    </h2>
    <div
      v-for="(horario, index) of filteredHorarios"
      v-show="verHorarios"
      :key="index"
    >
      <h3
        v-if="horario.paradas.length > 0"
        :ref="horario.frecuencia"
      >
        {{ normalizeFrecuencias(horario.frecuencia) }}
        <ui-icon
          v-if="verFrecuencia[horario.frecuencia]"
          class="clickable"
          icon="minus"
          size="small"
          @click="toggleFrecuencia(horario.frecuencia)"
        />
        <ui-icon
          v-else
          class="clickable"
          icon="plus"
          size="small"
          @click="toggleFrecuencia(horario.frecuencia)"
        />
      </h3>
      <div
        v-for="parada of horario.paradas"
        v-show="verFrecuencia[horario.frecuencia]"
        :key="parada.id"
        class="linea-horario__parada"
      >
        <div class="linea-horario__info">
          <h4>{{ parada.name }}</h4>
          <span :class="'zona-' + parada.zona">Zona {{ parada.zona }}</span>
        </div>
        <div class="linea-horario">
          <span
            v-for="(hora, index) of parada.horario"
            :key="index"
            class="linea-horario__horas"
          >
            <span v-if="hora.excepcion" class="linea-horario__excepcion">{{ hora.excepcion }}</span>
            <span class="linea-horario__hora">{{ hora.hora }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, PropType, reactive, ref, watch,
} from 'vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import Util from '@/composables/Util';
import { useStore } from '@/store';

export default defineComponent({
  name: 'LineaHorario',
  components: {
    UiIcon,
  },

  props: {
    tipoHorario: {
      type: String,
      default: 'ida',
    },

    horarios: {
      type: Array as PropType<TablaHorarios[]>,
      default: () => [],
    },

    filtro: {
      type: Object as PropType<LineaFiltro>,
      default: () => ({ salida: null, destino: null }),
    },
  },

  setup(props) {
    const store = useStore();
    const paradas = computed((): string[] => {
      if (props.tipoHorario === 'ida') return store.state.linea.paradasIda;
      return store.state.linea.paradasVuelta;
    });

    const { normalizeFrecuencias } = Util();
    const verHorarios = ref(true);
    const showHorario = ref(true);
    const verFrecuencia = reactive({
      LV: true,
      SD: true,
      F: true,
    });

    const filteredHorarios = ref<TablaHorarios[]>(props.horarios);

    watch(() => props.filtro, () => {
      if (!props.filtro.salida || !paradas.value) {
        filteredHorarios.value = props.horarios;
        showHorario.value = true;
        return;
      }

      const { salida, destino } = props.filtro;
      const salidaIndex = paradas.value.findIndex(p => p === salida);
      const destinoIndex = paradas.value.findIndex(p => p === destino);

      console.log(salidaIndex);
      console.log(destinoIndex);

      if (destinoIndex >= 0 && salidaIndex >= destinoIndex) {
        showHorario.value = false;
        return;
      }

      showHorario.value = true;
      filteredHorarios.value = JSON.parse(JSON.stringify(props.horarios));
      filteredHorarios.value.forEach(h => {
        const p = h.paradas;
        h.paradas = [];
        h.paradas.push(p[salidaIndex]);

        if (destinoIndex >= 0) h.paradas.push(p[destinoIndex]);
      });
    });

    const toggleHorario = (): boolean => {
      verHorarios.value = !verHorarios.value;
      return verHorarios.value;
    };

    const toggleFrecuencia = (frecuencia: 'LV' | 'SD' | 'F'): boolean => {
      verFrecuencia[frecuencia] = !verFrecuencia[frecuencia];
      return verFrecuencia[frecuencia];
    };

    return {
      store,
      paradas,
      filteredHorarios,
      normalizeFrecuencias,
      showHorario,
      verHorarios,
      verFrecuencia,
      toggleHorario,
      toggleFrecuencia,
    };
  },
});
</script>
