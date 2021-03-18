<template>
  <ui-card clickable>
    <template #title>
      <router-link class="linea-card-name text-capitalize" :to="{ name: 'Linea', params: { id: linea._id } }">
        Línea {{ linea.name }} - {{ recorrido }}
      </router-link>
    </template>
    <template #options>
      <ui-icon
        v-if="usuario"
        icon="star"
        class="clickable"
        :color="starColor"
        @click="toggleLineaFavorita"
      />
    </template>

    <span v-if="nucleos" class="text-capitalize">{{ nucleosNames.toLowerCase() }}</span>

    <template #footer>
      <ui-tooltip :content="`Paradas: ${linea.paradasInfo.length}`">
        <ui-icon icon="bus" />
        {{ linea.paradasInfo.length }}
      </ui-tooltip>

      <ui-tooltip v-if="linea.accesible" content="Accesible para personas con discapacidad">
        <ui-icon icon="wheelchair" class="mr-2" />
      </ui-tooltip>
    </template>

    <component
      :is="alertComponent"
      :v-show="showAlertBox"
      @ok="closeAlert"
      @cancel="closeAlert"
    />
  </ui-card>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType,
} from 'vue';
import UiCard from '@/components/ui/UiCard.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import { useStore } from '@/store';
import AlertBox from '@/composables/alertBox';

export default defineComponent({
  name: 'LineasItem',
  components: {
    UiCard,
    UiTooltip,
    UiIcon,
  },

  props: {
    linea: {
      type: Object as PropType<ApiLinea>,
      default: null,
    },

    nucleos: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
  },

  setup(props) {
    const store = useStore();
    const usuario = computed(() => store.state.usuario.usuario);
    const usuarioData = computed(() => store.state.usuario.autobuses);
    const isFavorite = computed(() => {
      if (!usuarioData.value || !usuarioData.value.lineas) return false;
      const linea = usuarioData.value.lineas.findIndex((l: string) => l === props.linea._id);
      return linea !== -1;
    });

    const starColor = computed(() => (isFavorite.value ? 'warning' : 'grey'));
    const {
      openAlert, closeAlert, showAlertBox, alertComponent,
    } = AlertBox();

    const nucleosNames = computed(() => props.nucleos.join(', '));
    const recorrido = computed(() => {
      const salida = props.nucleos[0].toLocaleLowerCase();
      const destino = props.nucleos[props.nucleos.length - 1].toLocaleLowerCase();
      return `${salida} - ${destino}`;
    });

    const addLineaFavorita = async () => {
      try {
        await store.dispatch('addLineaFavorita', props.linea._id);
      } catch (error) {
        openAlert({
          title: 'Error',
          message: error.message || 'Ha ocurrido un error tratando de añadir la línea como favorita',
        });
      }
    };

    const removeLineaFavorita = async () => {
      try {
        await store.dispatch('removeLineaFavorita', props.linea._id);
      } catch (error) {
        openAlert({
          title: 'Error',
          message: error.message || 'Ha ocurrido un error tratando de eliminar la línea como favorita',
        });
      }
    };

    const toggleLineaFavorita = () => {
      if (isFavorite.value) removeLineaFavorita();
      else addLineaFavorita();
    };

    return {
      store,
      usuario,
      isFavorite,
      starColor,
      nucleosNames,
      recorrido,
      addLineaFavorita,
      removeLineaFavorita,
      toggleLineaFavorita,
      openAlert,
      closeAlert,
      showAlertBox,
      alertComponent,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.linea-card-name {
    width: 100%;
    color: $text-color;
    display: block;
    font-weight: 400;
    text-decoration: none;

    &:hover {
        color: $primary;
    }

    @include mobile-l {
        font-weight: 500;
        font-size: 1.1em;
    }

    @include tablet {
        font-size: 1.25em;
    }
}

</style>
