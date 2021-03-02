<template>
  <div>
    <h2 :id="tipoHorario">
      Horarios de {{ tipoHorario }}
      <icon
        :icon-name="'ocultar/ver horarios'"
        @click="toggleHorario"
      >
        <icon-minus v-if="verHorarios" />
        <icon-plus v-else />
      </icon>
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
        <icon
          :icon-name="'ocultar/ver paradas'"
          @click="toggleFrecuencia(horario.frecuencia)"
        >
          <icon-minus v-if="verFrecuencia[horario.frecuencia]" />
          <icon-plus v-else />
        </icon>
      </h3>
      <div
        v-for="parada of horario.paradas"
        v-show="verFrecuencia[horario.frecuencia]"
        :key="parada._id"
        class="horarios-parada"
      >
        <div class="horarios-parada-info">
          <h4>{{ parada.name }}</h4>
          <span :class="'zona-' + parada.zona">Zona {{ parada.zona }}</span>
        </div>
        <span>
          <span
            v-for="(hora, index) of parada.horario"
            :key="index"
            class="horas"
          >
            <span v-if="hora.excepcion" class="excepcion">{{ hora.excepcion }}</span>
            <span class="hora">{{ hora.hora }}</span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import Icon from '@/components/icons/Icon.vue';
import Util from '@/composables/Util';

export default defineComponent({
  name: 'LineaHorario',
  components: {
    Icon,
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
