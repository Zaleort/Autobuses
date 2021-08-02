<template>
  <div v-if="usuario" class="content">
    <tarjetas />
    <lineas />
    <recorridos />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, ref,
} from 'vue';
import Lineas from '@/components/LineasFavoritas.vue';
import Tarjetas from '@/components/Tarjetas.vue';
import Recorridos from '@/components/Recorridos.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'HomeUser',
  components: {
    Tarjetas,
    Lineas,
    Recorridos,
  },

  setup() {
    const store = useStore();
    const usuario = computed<AuthUsuario>(() => store.state.usuario.usuario);

    const addRecorridoDialog = ref(false);
    const loading = ref(false);

    const openAddRecorridoDialog = () => addRecorridoDialog.value = true;

    return {
      usuario,
      addRecorridoDialog,
      openAddRecorridoDialog,
      loading,
    };
  },
});
</script>
