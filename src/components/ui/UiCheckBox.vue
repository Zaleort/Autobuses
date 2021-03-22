<template>
  <label
    :id="id"
    class="checkbox"
    :class="{
      'is-disabled': isDisabled,
      'is-bordered': border,
      'is-checked': checked,
    }"
  >
    <span
      class="checkbox__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': checked,
        'is-focus': focus
      }"
      tabindex="0"
      @focus="focus = true"
      @blur="focus = false"
      @keyup.space="$emit('update:checked', !checkValue)"
    >
      <input
        v-model="checkValue"
        class="checkbox__original"
        type="checkbox"
        :disabled="isDisabled"
        :value="label"
        :name="name"
      >
    </span>
    <span v-if="hasLabel" class="checkbox__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useFormInject from '@/composables/formInject';

export default defineComponent({
  name: 'UiCheckbox',
  props: {
    id: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    checked: {
      type: Boolean,
      default: false,
    },

    border: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: null,
    },
  },

  emits: ['update:checked'],

  setup(props, context) {
    const focus = ref(false);

    const { formDisabled } = useFormInject();
    const isDisabled = computed(() => props.disabled || formDisabled);

    const hasLabel = computed(() => {
      if (props.label || context.slots.default) {
        return true;
      }

      return false;
    });

    const checkValue = computed({
      get: () => props.checked,
      set: (check: boolean) => context.emit('update:checked', check),
    });

    return {
      focus,
      hasLabel,
      isDisabled,
      formDisabled,
      checkValue,
    };
  },
});
</script>
