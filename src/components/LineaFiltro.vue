<template>
  <div>
    <h3>Filtro</h3>
    <div class="linea__filtro">
      <div class="linea__filtro-group">
        <ui-label>
          Salida
          <template #content>
            <ui-select
              v-model:value="salida"
              filterable
              clearable
              @update:value="update"
            >
              <ui-option
                v-for="parada of paradas"
                :key="parada._id"
                :disabled="parada._id === destino"
                :value="parada._id"
                :label="parada.name"
              />
            </ui-select>
          </template>
        </ui-label>
      </div>
      <div class="linea__filtro-group">
        <ui-label>
          Destino
          <template #content>
            <ui-select
              v-model:value="destino"
              filterable
              clearable
              :disabled="!salida"
              @update:value="update"
            >
              <ui-option
                v-for="parada of paradas"
                :key="parada._id"
                :disabled="parada._id === salida"
                :value="parada._id"
                :label="parada.name"
              />
            </ui-select>
          </template>
        </ui-label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'LineaFiltro',
  props: {
    paradas: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['update'],

  setup(props, context) {
    const destino = ref(null);
    const salida = ref(null);

    const filtro = computed(() => ({ destino: destino.value, salida: salida.value }));

    const update = () => {
      context.emit('update', filtro.value);
    };

    return {
      destino,
      salida,
      update,
    };
  },
});
</script>
