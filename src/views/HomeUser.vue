<template>
  <div v-if="usuario" class="content">
    <h1>Tarjetas</h1>
    <h1>Líneas favoritas</h1>
    <div class="home-user__lineas">
      <lineas-item
        v-for="linea of lineas"
        :key="linea._id"
        :linea="linea"
        compact
      />
    </div>
    <h1>Recorridos</h1>
  </div>

  <ui-loading :loading="loading" />
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import { useStore } from '@/store';
import UiLoading from '@/components/ui/UiLoading.vue';
import LineasItem from '@/components/LineasItem.vue';

export default defineComponent({
  name: 'HomeUser',
  components: {
    UiLoading,
    LineasItem,
  },

  setup() {
    const store = useStore();
    const usuario = computed<AuthUsuario>(() => store.state.usuario.usuario);
    const datos = computed(() => store.state.usuario.autobuses);
    const lineas = computed<ApiLinea[]>(() => store.state.usuario.lineas);

    const loading = ref(false);

    onMounted(async () => {
      try {
        loading.value = true;

        if (!lineas.value || lineas.value.length === 0) {
          await store.dispatch('usuario/getLineasFavoritas');
        }
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    });

    return {
      usuario,
      datos,
      store,
      lineas,
      loading,
    };
  },
});
</script>
