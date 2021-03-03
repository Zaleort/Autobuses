<template>
  <div
    class="topbar"
    :class="{
      [`topbar--${color}`]: true,
    }"
    :style="{
      height: height,
      'justify-content': justify,
    }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTopbar',
  props: {
    height: {
      type: String,
      default: null,
    },

    justify: {
      type: String,
      default: 'space-between',
    },

    color: {
      type: String,
      default: 'primary',
    },
  },
});
</script>
