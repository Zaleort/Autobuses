<template>
  <div v-if="!loading" class="linea">
    <div class="linea-resumen">
      <h1 class="text-capitalize">
        Línea {{ name }} - {{ recorrido }}
      </h1>
      <div class="linea-resumen__info">
        <div class="linea-resumen__nucleos">
          <div
            v-for="nucleo of nucleosList"
            :key="nucleo._id"
            class="linea-resumen__nucleo"
          >
            <span class="linea-resumen__etiqueta">{{ nucleo }}</span>
            <span class="linea-resumen__separador" />
          </div>
        </div>
        <div class="linea-resumen__datos">
          <ui-tag size="small" class="mr-2">
            <ui-icon icon="bus" class="mr-2" />
            {{ paradas.length }}
          </ui-tag>
          <ui-tag size="small" class="mr-2">
            <ui-icon icon="clock" class="mr-2" />
            {{ duracion }}
          </ui-tag>
          <ui-tag size="small" class="mr-2">
            <ui-icon icon="running" class="mr-2" />
            {{ saltos }}
          </ui-tag>
          <ui-tag v-if="accesible" size="small">
            <ui-icon icon="wheelchair" class="mr-2" />
            Accesible
          </ui-tag>
        </div>
      </div>
    </div>

    <linea-filtro :paradas="paradas" @update="filtro = $event" />

    <linea-horario
      :tipo-horario="'ida'"
      :horarios="tablaHorariosIda"
      :filtro="filtro"
    />
    <linea-horario
      v-if="hasVuelta"
      :tipo-horario="'vuelta'"
      :horarios="tablaHorariosVuelta"
      :filtro="filtro"
    />
  </div>

  <component
    :is="alertComponent"
    :show="showAlertBox"
    @ok="closeAlert"
    @cancel="closeAlert"
  />

  <ui-loading :loading="loading" text="Cargando línea..." />
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import LineaHorario from '@/components/LineaHorario.vue';
import LineaFiltro from '@/components/LineaFiltro.vue';
import Util from '@/composables/Util';
import AlertBox from '@/composables/alertBox';
import { useRoute } from 'vue-router';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Linea',
  components: {
    LineaHorario,
    LineaFiltro,
  },

  setup() {
    const { hoursToMinutes } = Util();
    const route = useRoute();
    const store = useStore();

    const {
      openAlert, closeAlert, alertComponent, showAlertBox,
    } = AlertBox();

    const name = computed((): string => store.state.linea.name);
    const accesible = computed((): boolean => store.state.linea.accesible);
    const horarios = computed((): ApiHorarios => store.state.linea.horarios);
    const paradas = computed((): ApiParada[] => store.state.linea.paradas);
    const paradasIda = computed((): string[] => store.state.linea.paradasIda);
    const paradasVuelta = computed((): string[] => store.state.linea.paradasVuelta);
    const nucleos = computed((): ApiNucleo[] => store.state.linea.nucleos);
    const nucleosIda = computed((): string[] => store.state.linea.nucleosIda);
    const nucleosVuelta = computed((): string[] => store.state.linea.nucleosVuelta);
    const saltos = computed((): number => store.state.linea.saltos);

    const tablaHorariosIda = ref<TablaHorarios[]>([]);
    const tablaHorariosVuelta = ref<TablaHorarios[]>([]);

    const dropdownSalida = ref(false);
    const dropdownDestino = ref(false);

    const frecuenciasLV = ref<string[]>(['L-D', 'L-V', 'L-S', 'L-VDF', 'M-S', 'M-V', 'M-J', 'VD', 'L-X-V', 'L', 'V']);
    const frecuenciasSD = ref<string[]>(['L-D', 'L-S', 'L-VDF', 'S-D-F', 'DF', 'M-S', 'VD', 'S', 'D']);
    const frecuenciasF = ref<string[]>(['L-VDF', 'S-D-F', 'DF']);
    const frecuencias = ref<string[]>(['LV', 'SD', 'F']);

    const filtro = ref();
    const loading = ref(true);

    const hasVuelta = () => horarios.value?.vuelta != null;

    const recorrido = computed(() => {
      if (!nucleos.value || !nucleosIda.value) return '';

      const salidaId = nucleosIda.value[0];
      const destinoId = nucleosIda.value[nucleosIda.value.length - 1];
      const salida = nucleos.value.find(n => n._id === salidaId);
      const destino = nucleos.value.find(n => n._id === destinoId);

      if (!salida || !destino) {
        console.log('No se han encontrado los núcleos');
        return '';
      }

      const salidaName = salida.name.toLocaleLowerCase();
      const destinoName = destino.name.toLocaleLowerCase();
      return `${salidaName} - ${destinoName}`;
    });

    const nucleosList = computed((): string[] => {
      if (!nucleosIda.value || !nucleos.value) return [];

      const list: string[] = [];
      const arrNucleos = nucleos.value;
      nucleosIda.value.forEach(nucleoIda => {
        const nucleo = arrNucleos.find(n => n._id === nucleoIda);
        if (!nucleo) return;

        list.push(nucleo.name.toLowerCase());
      });

      return list;
    });

    const zonas = (): string[] => {
      if (paradas.value == null) return [];
      const arr: string[] = [];

      paradas.value.forEach(parada => {
        if (!arr.some(z => z === parada.zona)) {
          arr.push(parada.zona);
        }
      });

      return arr.sort();
    };

    // @TODO Resolver para casos como M-336
    const duracion = computed(() => {
      if (horarios.value == null || paradasIda.value == null) { return '?'; }
      const primera = paradasIda.value[0];
      const ultima = paradasIda.value[paradasIda.value.length - 1];

      let horaPrimera = '--';
      let horaUltima = '--';
      for (let i = 0; i < horarios.value.ida[primera].length; i++) {
        horaPrimera = horarios.value.ida[primera][i].hora;
        horaUltima = horarios.value.ida[ultima][i].hora;

        if (horaPrimera !== '--' && horaUltima !== '--') {
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
      if (!horarios.value || !paradasIda.value) return [];

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

    const getHorariosParadas = (paradasIds: string[], horariosIda: ApiHorarios['ida'], frecuencia: string) => {
      if (!paradas.value) return [];
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

      for (let i = 0; i < paradasIds.length; i++) {
        const paradaInfo = paradas.value.find(p => p._id === paradasIds[i]);
        if (!paradaInfo) return [];

        const { name, zona } = paradaInfo;
        const parada = {
          id: paradasIds[i],
          name,
          zona,
          horario: [] as Hora[],
        };

        horariosIda[paradasIds[i]].forEach(hora => {
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
      if (!horarios.value || !paradasIda.value) return [] as TablaHorarios[];

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
      if (!paradas.value) return '';
      const parada = paradas.value.find(p => p._id === _id);

      if (!parada) {
        console.warn(`No se encuentra la parada con ID: ${_id}`);
        return '';
      }

      return parada.name;
    };

    onMounted(async () => {
      try {
        await store.dispatch('linea/loadLinea', route.params.id);

        tablaHorariosIda.value = getTablaDeHorarios(true);
        tablaHorariosVuelta.value = getTablaDeHorarios(false);
      } catch (error) {
        openAlert({
          title: 'Error',
          message: error.message || 'Ha ocurrido un error obteniendo los datos de la línea',
        });
        console.error(error);
      } finally {
        loading.value = false;
      }
    });

    return {
      name,
      store,
      accesible,
      horarios,
      tablaHorariosIda,
      tablaHorariosVuelta,
      paradas,
      paradasIda,
      paradasVuelta,
      nucleos,
      nucleosIda,
      nucleosVuelta,
      dropdownSalida,
      dropdownDestino,
      saltos,
      frecuenciasLV,
      frecuenciasSD,
      frecuenciasF,
      frecuencias,
      filtro,
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
      openAlert,
      closeAlert,
      alertComponent,
      showAlertBox,
    };
  },
});
</script>
