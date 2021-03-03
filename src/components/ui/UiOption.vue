<template>
  <li
    v-show="visible"
    class="select-menu__option"
    :class="{
      'is-disabled': disabled,
      'is-selected': selected,
      'is-hovered': hovered,
    }"
    @click="handleSelect"
  >
    <slot>{{ label }}</slot>
  </li>
</template>

<script lang="ts">
import {
  computed, ComputedRef, defineComponent, inject, onBeforeUnmount, watch,
} from 'vue';

export default defineComponent({
  name: 'UiOption',
  props: {
    value: {
      type: [Number, String, Object, Array],
      default: null,
      required: true,
    },

    label: {
      type: String,
      default: null,
    },

    key: {
      type: [Number, String],
      default: null,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    created: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const addOption = inject<Function>('addOption', () => {});
    const removeOption = inject<Function>('removeOption', () => {});
    const addOptionCount = inject<Function>('addOptionCount', () => {});
    const substractOptionCount = inject<Function>('substractOptionCount', () => {});
    const handleSelectedValue = inject<Function>('handleSelectedValue', () => {});
    const selectValue = inject<ComputedRef>('value');
    const selectHovered = inject<ComputedRef>('hovered');
    const inputValue = inject<ComputedRef>('inputValue');
    const filterable = inject<boolean>('filterable', false);

    if (typeof selectValue === 'undefined' || typeof inputValue === 'undefined') {
      console.warn('Options debe estar dentro de un componente Select');
      return {};
    }

    const visible = computed(() => {
      // Por alguna razón inputValue.value se vuelve undefined al eliminar una opción con removeSelectedOption
      // cuando multiple es false
      if (typeof inputValue.value === 'undefined') return false;
      if (inputValue.value.length <= 0 || !filterable) {
        return true;
      }

      return props.label.toLocaleLowerCase().includes(inputValue.value.toLocaleLowerCase());
    });

    const option = computed(() => ({
      value: props.value,
      label: props.label || props.value,
      key: props.key || props.value,
      created: props.created,
      visible,
    }));

    watch(visible, (n, o) => {
      if (n === o) return;

      if (n) addOptionCount();
      else substractOptionCount();
    });

    const hovered = computed(() => option.value.key === selectHovered?.value);
    const selected = computed(() => {
      if (Array.isArray(selectValue.value)) {
        return selectValue.value.indexOf(props.value) !== -1;
      }

      return selectValue.value === props.value;
    });

    const handleSelect = () => {
      if (props.disabled) {
        return;
      }

      handleSelectedValue(option.value);
    };

    addOption(option.value);
    onBeforeUnmount(() => {
      removeOption(option.value);
    });

    return {
      selectValue,
      inputValue,
      selectHovered,
      filterable,
      hovered,
      selected,
      visible,
      handleSelect,
      option,
    };
  },
});
</script>
