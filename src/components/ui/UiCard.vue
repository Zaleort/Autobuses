<template>
  <div
    :class="{
      'card': true,
      [`card--${color}`]: true,
      'is-compact': compact,
    }"
  >
    <header v-if="hasHeader || hasOptions || hasTitle" class="card__header">
      <div
        v-if="hasTitle"
        class="card__title"
        :class="{ 'is-clickable': clickable }"
      >
        <slot name="title" />
      </div>

      <slot name="header" />

      <div
        v-if="hasOptions"
        class="card__options"
      >
        <slot name="options" />
      </div>
    </header>
    <slot />
    <footer
      v-if="hasFooter"
      class="card__footer"
      :class="{ 'is-actions': footerActions }"
    >
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UiCard',
  props: {
    color: {
      type: String,
      default: 'primary',
    },

    compact: {
      type: Boolean,
      default: false,
    },

    footerActions: {
      type: Boolean,
      default: false,
    },

    clickable: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const hasHeader = computed(() => !!context.slots.header);
    const hasTitle = computed(() => !!context.slots.title);
    const hasOptions = computed(() => !!context.slots.options);
    const hasFooter = computed(() => !!context.slots.footer);

    return {
      hasHeader,
      hasTitle,
      hasOptions,
      hasFooter,
    };
  },
});
</script>
