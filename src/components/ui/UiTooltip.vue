<template>
  <div class="tooltip__parent" :style="{ display }">
    <span
      :class="{
        'tooltip': true,
        [`ui-tooltip--${color}`]: true,
        [`ui-tooltip--${position}`]: true,
      }"
    >
      <slot name="content">{{ content }}</slot>
    </span>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'UiTooltip',
  props: {
    content: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: 'black',
    },

    position: {
      type: String,
      default: 'top',
      validator: (val: string) => ['top', 'bottom'].indexOf(val) !== -1,
    },

    display: {
      type: String,
      default: 'inline-block',
    },
  },
});
</script>
