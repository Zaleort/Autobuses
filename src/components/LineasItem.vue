<template>
  <div>
    <ui-card v-if="!compact" clickable>
      <template #title>
        <router-link class="linea-card-name text-capitalize" :to="{ name: 'Linea', params: { id: linea._id } }">
          {{ linea.name }} - {{ linea.recorrido.toLowerCase() }}
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

      <ui-tag
        v-for="(nucleo, index) of nucleos"
        :key="index"
        class="text-capitalize mb-2 mr-2 clickable"
        size="small"
        @click="$emit('select-nucleo', nucleo)"
      >
        {{ nucleo.toLowerCase() }}
      </ui-tag>

      <template #footer>
        <ui-tooltip :content="`Paradas: ${linea.paradasInfo.length}`">
          <ui-icon icon="bus" />
          {{ linea.paradasInfo.length }}
        </ui-tooltip>

        <ui-tooltip v-if="linea.accesible" content="Accesible para personas con discapacidad">
          <ui-icon icon="wheelchair" class="mr-2" />
        </ui-tooltip>
      </template>
    </ui-card>

    <ui-card
      v-else
      clickable
      :compact="compact"
    >
      <template #title>
        <router-link class="linea-card-name text-capitalize" :to="{ name: 'Linea', params: { id: linea._id } }">
          {{ linea.name }} - {{ linea.recorrido.toLowerCase() }}
        </router-link>
      </template>
      <template #options>
        <ui-icon
          v-if="usuario"
          icon="close"
          class="clickable"
          @click="removeLineaFavorita"
        />
      </template>
    </ui-card>

    <component
      :is="alertComponent"
      :show="showAlertBox"
      @ok="closeAlert"
      @cancel="closeAlert"
    />
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, PropType,
} from 'vue';
import { useStore } from '@/store';
import AlertBox from '@/composables/alertBox';

export default defineComponent({
  name: 'LineasItem',
  props: {
    linea: {
      type: Object as PropType<ApiLinea>,
      default: null,
    },

    nucleos: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    compact: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['select-nucleo'],

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

    const addLineaFavorita = async () => {
      try {
        await store.dispatch('usuario/addLineaFavorita', props.linea._id);
      } catch (error) {
        openAlert({
          title: 'Error',
          message: error.message || 'Ha ocurrido un error tratando de añadir la línea como favorita',
        });
      }
    };

    const removeLineaFavorita = async () => {
      try {
        if (props.compact) {
          openAlert({
            message: '¿Estás seguro que quieres borrar la línea?',
            title: 'Atención',
            type: 'warning',
            showCancelButton: true,
            okButtonAction: () => store.dispatch('usuario/removeLineaFavorita', props.linea._id),
          });
        } else {
          await store.dispatch('usuario/removeLineaFavorita', props.linea._id);
        }
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
