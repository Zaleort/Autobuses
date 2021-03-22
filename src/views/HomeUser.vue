<template>
  <div v-if="usuario" class="content">
    <h1>Tarjetas</h1>
    <h1>
      Líneas favoritas
      <ui-icon
        icon="plus"
        size="mini"
        color="primary"
        class="clickable"
        @click="openAddLineasDialog"
      />
    </h1>
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

  <ui-dialog
    v-model:visibility="addLineasDialog"
    :fullscreen="{ t: true }"
    width="75vw"
  >
    <template #header>
      Añadir líneas a favoritos
    </template>
    <ui-row>
      <ui-col
        v-for="(linea, i) of todasLineas"
        :key="linea._id"
        :dl="12"
      >
        <ui-card
          border
          :shadow="false"
          class="home-user__add-lineas-title text-capitalize mb-2 mt-0"
        >
          <ui-checkbox v-model:checked="checkedLineas[i]" class="mr-2" />
          {{ linea.name }} - {{ linea.recorrido.toLowerCase() }}
        </ui-card>
      </ui-col>
    </ui-row>

    <template #footer>
      <ui-button :loading="loadingAddLineas" @click="saveAddLineasDialog">
        Guardar
      </ui-button>
      <ui-button
        color="danger"
        class="mr-2"
        @click="addLineasDialog = false"
      >
        Cancelar
      </ui-button>
    </template>
  </ui-dialog>

  <ui-loading :loading="loading" />
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref,
} from 'vue';
import { useStore } from '@/store';
import LineasItem from '@/components/LineasItem.vue';

export default defineComponent({
  name: 'HomeUser',
  components: {
    LineasItem,
  },

  setup() {
    const store = useStore();
    const usuario = computed<AuthUsuario>(() => store.state.usuario.usuario);
    const datos = computed(() => store.state.usuario.autobuses);
    const lineas = computed<ApiLinea[]>(() => store.state.usuario.lineas);
    const todasLineas = computed<ApiLinea[]>(() => store.state.lineas.lineas);

    const checkedLineas = ref<boolean[]>([]);
    const setCheckedLineas = () => {
      checkedLineas.value = new Array(todasLineas.value.length);
      checkedLineas.value.fill(false);

      lineas.value.forEach(linea => {
        const i = todasLineas.value.findIndex(l => l._id === linea._id);
        if (i !== -1) checkedLineas.value[i] = true;
      });
    };

    const addTarjetaDialog = ref(false);
    const addLineasDialog = ref(false);
    const addRecorridoDialog = ref(false);
    const loading = ref(false);
    const loadingAddLineas = ref(false);

    const openAddTarjetaDialog = () => addTarjetaDialog.value = true;
    const openAddLineasDialog = async () => {
      if (!todasLineas.value || todasLineas.value.length === 0) {
        await store.dispatch('lineas/load');
      }

      setCheckedLineas();
      addLineasDialog.value = true;
    };

    const openAddRecorridoDialog = () => addRecorridoDialog.value = true;

    const saveAddLineasDialog = async () => {
      try {
        loadingAddLineas.value = true;
        const indexLineasFavoritas: number[] = [];
        const add: number[] = [];
        const remove: string[] = [];

        lineas.value.forEach(linea => {
          const i = todasLineas.value.findIndex(l => l._id === linea._id);
          indexLineasFavoritas.push(i);
        });

        checkedLineas.value.forEach((checked, index) => {
          const isFavorita = indexLineasFavoritas.some(l => l === index);

          if (!checked && isFavorita) {
            remove.push(todasLineas.value[index]._id);
          } else if (checked && !isFavorita) {
            add.push(index);
          }
        });

        add.forEach(async i => {
          await store.dispatch('usuario/addLineaFavorita', todasLineas.value[i]._id);
        });

        await store.dispatch('usuario/removeLineaFavorita', remove);
      } catch (error) {
        console.log(error);
      } finally {
        loadingAddLineas.value = false;
      }
    };

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
      checkedLineas,
      setCheckedLineas,
      todasLineas,
      addTarjetaDialog,
      openAddTarjetaDialog,
      addLineasDialog,
      openAddLineasDialog,
      saveAddLineasDialog,
      addRecorridoDialog,
      openAddRecorridoDialog,
      loading,
      loadingAddLineas,
    };
  },
});
</script>
