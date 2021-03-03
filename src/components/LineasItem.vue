<template>
  <ui-card clickable>
    <template #title>
      <router-link class="linea-card-name text-capitalize" :to="{ name: 'Linea', params: { id: linea._id } }">
        Línea {{ linea.name }} - {{ recorrido }}
      </router-link>
    </template>
    <template #options>
      <ui-icon icon="star" color="grey" />
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
  </ui-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ApiLinea } from '@/interfaces/apiResponses';
import UiCard from '@/components/ui/UiCard.vue';
import UiTooltip from '@/components/ui/UiTooltip.vue';
import UiIcon from '@/components/ui/UiIcon.vue';

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
    const nucleosNames = computed(() => props.nucleos.join(', '));
    const recorrido = computed(() => {
      const salida = props.nucleos[0].toLocaleLowerCase();
      const destino = props.nucleos[props.nucleos.length - 1].toLocaleLowerCase();
      return `${salida} - ${destino}`;
    });

    return {
      nucleosNames,
      recorrido,
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
