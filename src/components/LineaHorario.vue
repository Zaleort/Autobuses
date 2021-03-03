<template>
  <div>
    <h2 :id="tipoHorario">
      Horarios de {{ tipoHorario }}
      <ui-icon
        v-if="verHorarios"
        icon="minus"
        size="mini"
        @click="toggleHorario"
      />
      <ui-icon
        v-else
        icon="plus"
        size="mini"
        @click="toggleHorario"
      />
    </h2>
    <div
      v-for="(horario, index) of horarios"
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
          icon="minus"
          size="small"
          @click="toggleFrecuencia(horario.frecuencia)"
        />
        <ui-icon
          v-else
          icon="plus"
          size="small"
          @click="toggleFrecuencia(horario.frecuencia)"
        />
      </h3>
      <div
        v-for="parada of horario.paradas"
        v-show="verFrecuencia[horario.frecuencia]"
        :key="parada._id"
        class="linea-horario__parada"
      >
        <div class="linea-horario__info">
          <h4>{{ parada.name }}</h4>
          <span :class="'zona-' + parada.zona">Zona {{ parada.zona }}</span>
        </div>
        <span>
          <span
            v-for="(hora, index) of parada.horario"
            :key="index"
            class="linea-horario__horas"
          >
            <span v-if="hora.excepcion" class="linea-horario__excepcion">{{ hora.excepcion }}</span>
            <span class="linea-horario__hora">{{ hora.hora }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import Util from '@/composables/Util';

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
      type: Array,
      default: () => [],
    },

    filtro: {
      type: Object,
      default: () => ({ salida: null, destino: null }),
    },
  },

  setup() {
    const { normalizeFrecuencias } = Util();
    const verHorarios = ref(true);
    const verFrecuencia = reactive({
      LV: true,
      SD: true,
      F: true,
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
      normalizeFrecuencias,
      verHorarios,
      verFrecuencia,
      toggleHorario,
      toggleFrecuencia,
    };
  },
});
</script>
