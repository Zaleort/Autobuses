<template>
  <td
    :class="{
      'table__data': true,
      [`table__data--${tableSize}`]: true,
    }"
    :style="{
      textAlign: align,
    }"
  >
    <slot />
  </td>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'UiTableData',
  props: {
    align: {
      type: String,
      default: null,
    },
  },

  setup() {
    const tableSize = inject('tableSize', 'normal');

    return {
      tableSize,
    };
  },
});
</script>
