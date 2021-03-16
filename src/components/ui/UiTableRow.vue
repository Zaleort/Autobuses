<template>
  <tr
    :class="{
      'table__row': true,
      [`table__row--${color}`]: color !== null,
    }"
  >
    <slot />
  </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTableRow',
  props: {
    color: {
      type: String,
      default: null,
    },
  },
});
</script>
