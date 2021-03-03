<template>
  <div v-if="!loading">
    <div class="linea-resumen">
      <h1 class="capitalize">
        Línea {{ name }} - {{ recorrido }}
      </h1>
      <div class="linea-resumen-info">
        <div class="linea-resumen-nucleos">
          <div
            v-for="nucleo of nucleosList"
            :key="nucleo._id"
            class="linea-resumen-nucleo"
          >
            <span class="linea-resumen-nucleo-etiqueta">{{ nucleo }}</span>
            <span class="linea-resumen-nucleo-separador" />
          </div>
        </div>
        <div class="linea-resumen-datos">
          <span class="linea-resumen-dato">
            <ui-icon icon="bus" />
            {{ paradasInfo.length }}
          </span>
          <span class="linea-resumen-dato">
            <ui-icon icon="clock" />
            {{ duracion }}
          </span>
          <span class="linea-resumen-dato">
            <ui-icon icon="running" />
            {{ saltos }}
          </span>
          <span v-if="accesible" class="linea-resumen-dato">
            <ui-icon icon="wheelchair" />
            Accesible
          </span>
        </div>
      </div>
    </div>
    <div>
      <span>
        <h3>Filtro</h3>
      </span>
      <div class="horarios-filtro">
        <div class="horarios-filtro-group relative" @click-outside="dropdownSalida = false">
          <label for="paradaSalida">Salida</label>
          <ui-select
            v-model:value="filtroParadaSalida"
            filterable
            clearable
          >
            <ui-option
              v-for="parada of paradasInfo"
              :key="parada._id"
              :value="parada._id"
              :label="parada.name"
            />
          </ui-select>
        </div>
        <div class="horarios-filtro-group relative" @click-outside="dropdownDestino = false">
          <label for="paradaDestino">Destino</label>
          <ui-select
            v-model:value="filtroParadaDestino"
            filterable
            clearable
            :disabled="!filtroParadaSalida"
          >
            <ui-option
              v-for="parada of paradasInfo"
              :key="parada._id"
              :value="parada._id"
              :label="parada.name"
            />
          </ui-select>
        </div>
      </div>
    </div>
    <div class="tabla-horarios">
      <linea-horario :tipo-horario="'ida'" :horarios="tablaHorariosIda" />
      <linea-horario
        v-if="hasVuelta"
        :tipo-horario="'vuelta'"
        :horarios="tablaHorariosVuelta"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import LineaHorario from '@/components/LineaHorario.vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import UiSelect from '@/components/ui/UiSelect.vue';
import UiOption from '@/components/ui/UiOption.vue';
import Util from '@/composables/Util';
import {
  ApiHorario, ApiHorarios, ApiParada, ApiNucleo,
} from '@/interfaces/apiResponses';
import { TablaHorarios, Hora } from '@/interfaces/linea';
import ApiLineas from '@/lib/ApiLineas';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'Linea',
  components: {
    LineaHorario,
    UiIcon,
    UiSelect,
    UiOption,
  },

  setup() {
    const { hoursToMinutes } = Util();
    const route = useRoute();

    const name = ref('');
    const accesible = ref(false);

    const horarios = ref<ApiHorarios>();
    const tablaHorariosIda = ref<TablaHorarios[]>([]);
    const tablaHorariosVuelta = ref<TablaHorarios[]>([]);

    const paradasIda = ref<string[]>([]);
    const paradasVuelta = ref<string[]>();
    const paradasInfo = ref<ApiParada[]>([]);

    const nucleosIda = ref<string[]>([]);
    const nucleosVuelta = ref<string[]>();
    const nucleosInfo = ref<ApiNucleo[]>([]);

    const filtroParadaSalida = ref('');
    const filtroParadaDestino = ref('');
    const filtroFecha = ref('');
    const filtroHora = ref('');

    const dropdownSalida = ref(false);
    const dropdownDestino = ref(false);

    const saltos = ref(0);

    const frecuenciasLV = ref<string[]>(['L-D', 'L-V', 'L-S', 'L-VDF', 'M-S', 'M-V', 'M-J', 'VD', 'L-X-V', 'L', 'V']);
    const frecuenciasSD = ref<string[]>(['L-D', 'L-S', 'L-VDF', 'S-D-F', 'DF', 'M-S', 'VD', 'S', 'D']);
    const frecuenciasF = ref<string[]>(['L-VDF', 'S-D-F', 'DF']);
    const frecuencias = ref<string[]>(['LV', 'SD', 'F']);

    const loading = ref(true);
    const apiLinea = ApiLineas;

    const hasVuelta = () => horarios.value?.vuelta != null;

    const recorrido = computed(() => {
      const salida = nucleosInfo.value.find(n => n._id === nucleosIda.value[0]);
      const destino = nucleosInfo.value.find(n => n._id === nucleosIda.value[nucleosIda.value.length - 1]);

      if (!salida || !destino) {
        console.log('No se han encontrado los núcleos');
        return '';
      }

      const salidaName = salida.name.toLocaleLowerCase();
      const destinoName = destino.name.toLocaleLowerCase();
      return `${salidaName} - ${destinoName}`;
    });

    const nucleosList = computed((): string[] => {
      if (nucleosIda.value == null) { return []; }

      const nucleos: string[] = [];
      nucleosIda.value.forEach(nucleoIda => {
        const nucleo = nucleosInfo.value.find(n => n._id === nucleoIda);
        if (!nucleo) return;

        nucleos.push(nucleo.name.toLowerCase());
      });

      return nucleos;
    });

    const zonas = (): string[] => {
      const arr: string[] = [];

      paradasInfo.value.forEach(parada => {
        if (!arr.some(z => z === parada.zona)) {
          arr.push(parada.zona);
        }
      });

      return arr.sort();
    };

    // @TODO Resolver para casos como M-336
    const duracion = computed(() => {
      if (horarios.value == null) { return '?'; }
      const primera = paradasIda.value[0];
      const ultima = paradasIda.value[paradasIda.value.length - 1];

      let horaPrimera = '--';
      let horaUltima = '--';
      for (let i = 0; i < horarios.value.ida[primera].length; i++) {
        horaPrimera = horarios.value.ida[primera][i].hora;
        horaUltima = horarios.value.ida[ultima][i].hora;

        if (horaPrimera !== '--' || horaUltima !== '--') {
          break;
        }
      }

      const minutosPrimera = hoursToMinutes(horaPrimera);
      const minutosUltima = hoursToMinutes(horaUltima);

      const minutos = minutosUltima - minutosPrimera;
      if (minutos < 60) {
        return `${minutos} min`;
      }

      const horas = Math.floor(minutos / 60);
      const minutosFinal = minutos - (60 * horas);

      return `${horas}h ${minutosFinal}m`;
    });

    const frecuenciasIda = (): string[] => {
      if (!horarios.value) return [];

      const setFrecuencias: Set<string> = new Set();
      const primeraParada = paradasIda.value[0];
      horarios.value.ida[primeraParada].forEach((horario: ApiHorario) => {
        setFrecuencias.add(horario.frecuencia);
      });

      return Array.from(setFrecuencias);
    };

    const frecuenciasVuelta = (): string[] => {
      if (!paradasVuelta.value || !horarios.value) { return []; }
      const setFrecuencias: Set<string> = new Set();

      const primeraParada = paradasVuelta.value[0];
      horarios.value.vuelta[primeraParada].forEach((horario: ApiHorario) => {
        setFrecuencias.add(horario.frecuencia);
      });

      return Array.from(setFrecuencias);
    };

    const getExcepcion = (dias: string, frecuencia: string): string | null => {
      if (dias === 'LV') {
        switch (frecuencia) {
          case 'M-V':
          case 'M-S':
            return '-L';
          case 'M-J':
            return 'MJ';
          case 'VD':
          case 'V':
            return 'V';
          case 'L-X-V':
            return 'LXV';
          case 'L':
            return 'L';
          default:
            return null;
        }
      } else if (dias === 'SD') {
        switch (frecuencia) {
          case 'L-S':
          case 'M-S':
          case 'S':
            return 'S';
          case 'L-VDF':
          case 'DF':
          case 'VD':
          case 'D':
            return 'D';
          default:
            return null;
        }
      } else {
        return null;
      }
    };

    const getHorariosParadas = (paradas: string[], horariosIda: ApiHorarios['ida'], frecuencia: string) => {
      const arr = [];
      let dias: string[];

      if (frecuencia === 'LV') {
        dias = frecuenciasLV.value;
      } else if (frecuencia === 'SD') {
        dias = frecuenciasSD.value;
      } else if (frecuencia === 'F') {
        dias = frecuenciasF.value;
      } else {
        return [];
      }

      for (let i = 0; i < paradas.length; i++) {
        const paradaInfo = paradasInfo.value.find(p => p._id === paradas[i]);
        if (!paradaInfo) return [];

        const { name, zona } = paradaInfo;
        const parada = {
          id: paradas[i],
          name,
          zona,
          horario: [] as Hora[],
        };

        horariosIda[paradas[i]].forEach(hora => {
          if (dias.some(d => d === hora.frecuencia) && hora.hora !== '--') {
            const horario = {
              hora: hora.hora,
              excepcion: getExcepcion(frecuencia, hora.frecuencia),
            };

            parada.horario.push(horario);
          }
        });

        if (parada.horario.length > 0) {
          arr.push(parada);
        }
      }

      return arr;
    };

    const getTablaDeHorarios = (ida: boolean): TablaHorarios[] => {
      if (!horarios.value) return [] as TablaHorarios[];

      let paradas: string[];
      let tablaHorarios: ApiHorarios['ida'] | ApiHorarios['vuelta'];

      if (ida) {
        paradas = paradasIda.value;
        tablaHorarios = horarios.value.ida;
      } else if (paradasVuelta.value) {
        paradas = paradasVuelta.value;
        tablaHorarios = horarios.value.vuelta;
      } else {
        return [];
      }

      const horario = [
        { frecuencia: 'LV', paradas: getHorariosParadas(paradas, tablaHorarios, 'LV') },
        { frecuencia: 'SD', paradas: getHorariosParadas(paradas, tablaHorarios, 'SD') },
        { frecuencia: 'F', paradas: getHorariosParadas(paradas, tablaHorarios, 'F') },
      ];

      return horario;
    };

    const getParadaName = (_id: string): string => {
      const parada = paradasInfo.value.find(p => p._id === _id);

      if (!parada) {
        console.warn(`No se encuentra la parada con ID: ${_id}`);
        return '';
      }

      return parada.name;
    };

    onMounted(async () => {
      try {
        const res = await apiLinea.getLinea(route.params.id as string);
        name.value = res.name;
        accesible.value = res.accesible;
        horarios.value = res.horarios;
        paradasIda.value = res.paradasIda;
        paradasVuelta.value = res.paradasVuelta;
        paradasInfo.value = res.paradasInfo;
        nucleosIda.value = res.nucleosIda;
        nucleosVuelta.value = res.nucleosVuelta;
        nucleosInfo.value = res.nucleosInfo;
        saltos.value = res.saltos;

        tablaHorariosIda.value = getTablaDeHorarios(true);
        tablaHorariosVuelta.value = getTablaDeHorarios(false);

        loading.value = false;
      } catch (error) {
        console.error(error);
      }
    });

    return {
      name,
      accesible,
      horarios,
      tablaHorariosIda,
      tablaHorariosVuelta,
      paradasIda,
      paradasVuelta,
      paradasInfo,
      nucleosIda,
      nucleosVuelta,
      nucleosInfo,
      filtroParadaSalida,
      filtroParadaDestino,
      filtroFecha,
      filtroHora,
      dropdownSalida,
      dropdownDestino,
      saltos,
      frecuenciasLV,
      frecuenciasSD,
      frecuenciasF,
      frecuencias,
      loading,
      hasVuelta,
      recorrido,
      nucleosList,
      zonas,
      duracion,
      frecuenciasIda,
      frecuenciasVuelta,
      getExcepcion,
      getHorariosParadas,
      getTablaDeHorarios,
      getParadaName,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.linea-resumen {
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;

  @include tablet { margin: 2em 0; }
}

.linea-resumen-info {
  display: flex;
  flex-direction: column;
}

.linea-resumen-nucleos {
  .linea-resumen-nucleo:not(:last-child) .linea-resumen-nucleo-separador {
    vertical-align: middle;
    display: inline-block;
    width: 9px;
    height: 3px;
    background-color: $orange200;

    @include tablet {
      width: 18px;
    }
  }
}

.linea-resumen-nucleo {
  font-size: 0.8em;
  display: inline-block;

  @include mobile-l {
    font-size: 0.9em;
  }

  @include tablet {
    font-size: 1em;
  }
}

.linea-resumen-nucleo-etiqueta {
  display: inline-block;
  text-transform: capitalize;
  padding: 6px 12px;
  margin: 5px 0;
  background-color: $orange100;
  border-radius: $pill;
  border: 1px solid $orange200;
}

.linea-resumen-datos {
  display: none;
  margin: 12px 0 0 0;

  @include mobile-l {
    display: flex;
  }
}

.linea-resumen-dato {
  display: flex;
  align-items: center;
  position: relative;
  padding: 3px 12px;
  margin: 5px 3px;
  color: $white;
  background-color: $primary;
  border-radius: $pill;

  svg {
    margin-right: 5px;
    margin-bottom: 1px;
  }

  &:hover + .tooltip {
    visibility: visible;
  }
}

.horarios-filtro {
  display: flex;
  flex-direction: column;
  margin-bottom: 2em;

  @include tablet {
    flex-direction: row;
  }
}

.horarios-filtro-group {
  margin: 5px 0;
  flex-grow: 1;

  @include tablet {
    margin: 0 5px;
  }
}

.horarios-parada {
  padding: 16px 12px;
  margin-bottom: 24px;
  background-color: #FFF;
  border-radius: $border-radius;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.horarios-parada-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1em;

  h4 {
    margin: 7px 0;
    font-weight: 400;
  }

  @include tablet {
    flex-direction: row;
    align-items: center;
  }
}

.horas {
  display: inline-flex;
  min-width: 100px;
  margin: 7px 7px 7px 0;
}

.excepcion {
  display: inline-block;
  text-align: center;
  font-weight: 500;
  padding: 4px;
  border: 1px solid $red500;
  background-color: $red400;
  color: $grey100;
}

.hora {
  display: inline-block;
  flex-grow: 1;
  text-align: center;
  letter-spacing: 1px;
  font-weight: 300;
  padding: 4px;
  border: 1px solid $orange200;
  background-color: $orange100;
  color: $grey800;
}
</style>
