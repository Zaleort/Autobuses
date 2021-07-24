<template>
  <div v-if="usuario" class="content">
    <h1>
      Tarjetas
      <ui-icon
        icon="plus"
        size="mini"
        color="primary"
        class="clickable"
        @click="openTarjetaDialog"
      />
    </h1>

    <ui-alert v-if="!datos.tarjetas || datos.tarjetas.length === 0" color="info">
      Haz un seguimiento del saldo de tus tarjetas y calcula el coste de tus viajes
    </ui-alert>

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

    <ui-alert v-if="!lineas || lineas.length === 0" color="info">
      Haz click en el + para crear accesos directos a las líneas que más utilices
    </ui-alert>

    <div class="home-user__lineas">
      <lineas-item
        v-for="linea of lineas"
        :key="linea._id"
        :linea="linea"
        compact
      />
    </div>
    <h1>Recorridos</h1>

    <ui-alert v-if="!datos.recorridos || datos.recorridos.length === 0" color="info">
      Selecciona tus destinos más frecuentes para ver cuándo saldrán los próximos buses
    </ui-alert>
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
          <ui-checkbox v-model:checked="checkedLineas[i]" class="width-100 mr-2">
            {{ linea.name }} - {{ linea.recorrido.toLowerCase() }}
          </ui-checkbox>
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

  <ui-dialog v-model:visibility="tarjetaDialog" :fullscreen="{ t: true }">
    <template #header>
      Crear nueva tarjeta
    </template>

    <template #footer>
      <ui-button :loading="loadingTarjeta" @click="saveTarjetaDialog">
        Guardar
      </ui-button>
      <ui-button
        color="danger"
        class="mr-2"
        @click="tarjetaDialog = false"
      >
        Cancelar
      </ui-button>
    </template>
  </ui-dialog>

  <ui-loading :loading="loading" />
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, reactive, ref,
} from 'vue';
import { useStore } from '@/store';
import LineasItem from '@/components/LineasItem.vue';
import UiAlert from '@/components/ui/UiAlert.vue';

export default defineComponent({
  name: 'HomeUser',
  components: {
    LineasItem,
    UiAlert,
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

    const addLineasDialog = ref(false);
    const loadingAddLineas = ref(false);
    const openAddLineasDialog = async () => {
      if (!todasLineas.value || todasLineas.value.length === 0) {
        await store.dispatch('lineas/load');
      }

      setCheckedLineas();
      addLineasDialog.value = true;
    };

    const saveAddLineasDialog = async () => {
      try {
        loadingAddLineas.value = true;
        const indexLineasFavoritas: number[] = [];
        const add: string[] = [];
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
            add.push(todasLineas.value[index]._id);
          }
        });

        await store.dispatch('usuario/addLineaFavorita', add);
        await store.dispatch('usuario/removeLineaFavorita', remove);
        addLineasDialog.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        loadingAddLineas.value = false;
      }
    };

    let nuevaTarjeta = reactive({
      nombre: 'Nueva tarjeta',
      saldo: 0.0,
      viajes: 0,
    });

    const tarjetaDialog = ref(false);
    const loadingTarjeta = ref(false);
    const openTarjetaDialog = () => tarjetaDialog.value = true;
    const saveTarjetaDialog = async () => {
      try {
        loadingTarjeta.value = true;
        await store.dispatch('usuario/addTarjeta', nuevaTarjeta);
        nuevaTarjeta = {
          nombre: 'Nueva tarjeta',
          saldo: 0.0,
          viajes: 0,
        };
      } catch (error) {
        console.log(error);
      } finally {
        loadingTarjeta.value = false;
      }
    };

    const addRecorridoDialog = ref(false);
    const loading = ref(false);

    const openAddRecorridoDialog = () => addRecorridoDialog.value = true;

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
      tarjetaDialog,
      openTarjetaDialog,
      saveTarjetaDialog,
      addLineasDialog,
      openAddLineasDialog,
      saveAddLineasDialog,
      addRecorridoDialog,
      openAddRecorridoDialog,
      loading,
      loadingAddLineas,
      loadingTarjeta,
    };
  },
});
</script>
