<template>
  <div class="tarifa">
    <h1>Tarifas</h1>
    <div class="tarifa__descripcion mb-3">
      <p>
        El Sistema Tarifario Integrado (STI) del Consorcio de Transporte Metropolitano del Área de Almería divide
        el territorio en 10 zonas, con las que se calcula el precio del viaje según los "saltos" de zonas que haya
        entre el origen y el destino.
      </p>
    </div>
    <ui-table
      :headings="headings"
      :items="items"
      size="large"
    >
      <ui-table-row v-for="(item, index) of items" :key="index">
        <ui-table-data>{{ item.saltos }}</ui-table-data>
        <ui-table-data>{{ item.billete }}€</ui-table-data>
        <ui-table-data>{{ item.tarjeta }}€</ui-table-data>
      </ui-table-row>
    </ui-table>

    <p>Fianza de la tarjeta: 1.50€</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Tarifas',
  setup() {
    const headings = ref([
      { name: 'Saltos' },
      { name: 'Billete' },
      { name: 'Tarjeta' },
    ]);

    const items = ref([
      { saltos: '0-1', billete: '1.35', tarjeta: '0.86' },
      { saltos: '2', billete: '2.00', tarjeta: '1.39' },
      { saltos: '3', billete: '3.00', tarjeta: '2.01' },
      { saltos: '4', billete: '3.70', tarjeta: '2.57' },
      { saltos: '5', billete: '4.95', tarjeta: '3.34' },
      { saltos: '6', billete: '5.50', tarjeta: '3.84' },
      { saltos: '7', billete: '6.50', tarjeta: '4.55' },
      { saltos: '8', billete: '7.30', tarjeta: '5.09' },
    ]);

    return {
      items,
      headings,
    };
  },
});
</script>
