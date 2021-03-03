<template>
  <div
    v-click-outside="close"
    :class="{
      'select': true,
      [`ui-select--${inputSize}`]: inputSize,
    }"
    @click.stop="toggle"
    @keydown="handleKey"
  >
    <ui-input
      v-model:value="inputValue"
      :class="{ 'is-error': error !== null }"
      type="text"
      :disabled="isDisabled"
      :readonly="readonly || !filterable"
      :size="inputSize"
      :placeholder="currentPlaceholder"
      :color="color"
      @input="remote ? debouncedHandleInput() : handleInput()"
      @change="remote ? debouncedHandleChange() : handleChange()"
    >
      <template v-if="hasPrepend" #prepend>
        <slot name="prepend" />
        <div v-if="multiple" class="select__tags">
          <ui-tag
            v-for="item in selected"
            :key="item.key"
            :closable="!isDisabled"
            :color="tagColor"
            size="small"
            @close="removeSelectedValue(item)"
          >
            {{ item.label }}
          </ui-tag>
        </div>
      </template>

      <template #append>
        <slot name="append" />
        <ui-icon
          v-if="clearable"
          v-show="value !== null"
          icon="timesCircle"
          class="clickable"
          @click.stop="clearSelectedValues()"
        />
      </template>
    </ui-input>

    <transition name="select-show">
      <ul v-show="visible" class="select-menu">
        <template v-if="emptyText && (!allowCreate || loading || (allowCreate && options.length === 0 ))">
          <slot v-if="$slots.empty" name="empty" />
          <p v-else class="select-menu__empty">
            <ui-icon
              v-if="loading"
              icon="loading"
              class="mr-2 ui-icon-loading"
            />
            {{ emptyText }}
          </p>
        </template>
        <ui-option
          v-if="showCreatedOption"
          :key="Date.now()"
          :value="inputValue"
          :label="inputValue"
          created
        />
        <slot />
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, computed, ref, reactive, watch, onMounted, provide,
} from 'vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiTag from '@/components/ui/UiTag.vue';
import UiOption from '@/components/ui/UiOption.vue';
import { UiSelectOption } from '@/interfaces/Select';
import useFormInject from '@/composables/formInject';
import debounce from '@/lib/debounce';

export default defineComponent({
  name: 'UiSelect',
  components: {
    UiInput,
    UiTag,
    UiOption,
  },

  props: {
    value: {
      type: [Number, String, Object, Array],
      default: '',
    },

    valueKey: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: 'Seleccionar',
    },

    multiple: {
      type: Boolean,
      default: false,
    },

    clearable: {
      type: Boolean,
      default: false,
    },

    filterable: {
      type: Boolean,
      default: false,
    },

    allowCreate: {
      type: Boolean,
      default: false,
    },

    remote: {
      type: Boolean,
      default: false,
    },

    remoteMethod: {
      type: Function,
      default: null,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
      validator: (value: string) => ['large', 'normal', 'small'].indexOf(value) !== -1,
    },

    validator: {
      type: Function,
      default: null,
    },

    validateOn: {
      type: String,
      default: 'submit',
    },

    color: {
      type: String,
      default: null,
    },

    tagColor: {
      type: String,
      default: 'primary',
    },
  },

  emits: ['update:value'],

  setup(props, context) {
    const inputValue = ref('');
    const error = ref<string | null>(null);
    const currentPlaceholder = ref(props.multiple ? '' : props.placeholder);
    const cachedCurrentPlaceholder = ref('');
    const options = reactive<UiSelectOption[]>([]);
    const optionHovered = ref<string | number | null>(null);
    const optionHoveredIndex = ref(-1);
    let selected = props.multiple ? reactive<UiSelectOption[]>([]) : reactive<UiSelectOption | any>({});
    const filteredOptionsCount = ref(0);
    const visible = ref(false);
    const {
      formDisabled,
      formSize,
      formValidateOn,
      formValidators,
    } = useFormInject();

    const isDisabled = computed(() => props.disabled || formDisabled);
    const inputSize = computed(() => props.size || formSize);
    const inputValidateOn = computed(() => props.validateOn || formValidateOn);
    const hasPrepend = computed(() => !!context.slots.prepend || props.multiple);

    const emptyText = computed(() => {
      if (props.loading) {
        return 'Cargando...';
      }

      if (props.remote && inputValue.value === '' && options.length === 0) {
        return null;
      }

      if (props.filterable && inputValue.value && options.length > 0 && filteredOptionsCount.value === 0) {
        return 'Sin resultados';
      }

      if (options.length === 0) {
        return 'Sin opciones';
      }

      return null;
    });

    const showCreatedOption = computed(() => {
      const hasExistingOption = options.filter(option => !option.created)
        .some(option => option.label === inputValue.value);
      return props.filterable && props.allowCreate && inputValue.value !== '' && !hasExistingOption;
    });

    const addOption = (option: UiSelectOption) => {
      if (options.some(o => o.key === option.key)) return;

      if (option.created) options.unshift(option);
      else options.push(option);
    };

    const removeOption = (option: UiSelectOption) => {
      const i = options.findIndex(o => o.key === option.key);

      if (i >= 0) {
        options.splice(i, 1);
      }
    };

    const addSelectedValue = (val: UiSelectOption) => {
      if (props.multiple && Array.isArray(selected)) {
        selected.push(val);
        context.emit('update:value', selected.map(s => s.value));
        inputValue.value = '';
      } else {
        selected = reactive(val);
        context.emit('update:value', selected.value);
        inputValue.value = val.label;
      }
    };

    const removeSelectedValue = (val: UiSelectOption) => {
      if (props.multiple && Array.isArray(selected)) {
        const i = selected.findIndex((v: any) => v.key === val.key);
        selected.splice(i, 1);
        context.emit('update:value', selected.map(s => s.value));
      } else {
        selected = {} as UiSelectOption;
        context.emit('update:value', null);
      }

      inputValue.value = '';
    };

    const clearSelectedValues = () => {
      if (props.multiple && Array.isArray(selected)) {
        selected.splice(0, selected.length);
        context.emit('update:value', []);
      } else {
        selected = {} as UiSelectOption;
        context.emit('update:value', null);
      }

      inputValue.value = '';
    };

    const addOptionCount = () => filteredOptionsCount.value += 1;
    const substractOptionCount = () => filteredOptionsCount.value -= 1;

    const resetHovered = () => {
      optionHovered.value = null;
      optionHoveredIndex.value = -1;
    };

    const getNextVisibleOptionIndex = () => {
      let i = optionHoveredIndex.value + 1;
      if (i >= options.length) {
        i = 0;
      }

      for (i; i < options.length; i++) {
        if (options[i].visible) {
          return i;
        }
      }

      i = 0;
      for (i; i < optionHoveredIndex.value; i++) {
        if (options[i].visible) {
          return i;
        }
      }

      return optionHoveredIndex.value;
    };

    const getPreviousVisibleOptionIndex = () => {
      let i = optionHoveredIndex.value - 1;
      if (i <= -1) {
        i = options.length - 1;
      }

      for (i; i >= 0; i--) {
        if (options[i].visible) {
          return i;
        }
      }

      return optionHoveredIndex.value;
    };

    const toggle = () => {
      if (!props.disabled) {
        visible.value = !visible.value;
        resetHovered();
      }
    };

    const close = () => {
      visible.value = false;
      resetHovered();
    };

    watch(visible, () => {
      if (!props.filterable || props.multiple) {
        return;
      }

      if (visible.value) {
        cachedCurrentPlaceholder.value = inputValue.value;
        currentPlaceholder.value = inputValue.value;
        inputValue.value = '';
      } else {
        currentPlaceholder.value = props.placeholder;
        inputValue.value = selected.label;
      }
    });

    const handleInput = () => {
      resetHovered();

      if (props.remote && typeof props.remoteMethod === 'function') {
        props.remoteMethod(inputValue.value);
      }

      if (typeof props.validator === 'function' && inputValidateOn.value === 'input') {
        error.value = props.validator();
      }
    };

    const handleChange = () => {
      resetHovered();

      if (props.remote && typeof props.remoteMethod === 'function') {
        props.remoteMethod(inputValue.value);
      }

      if (typeof props.validator === 'function' && inputValidateOn.value === 'change') {
        error.value = props.validator();
      }
    };

    const debouncedHandleInput = debounce(300, () => handleInput());
    const debouncedHandleChange = debounce(300, () => handleChange());

    const handleSelectedValue = (val: UiSelectOption) => {
      let isSelected = false;

      if (Array.isArray(selected)) {
        const i = selected.findIndex(o => o.key === val.key);
        isSelected = i >= 0;
      } else {
        isSelected = selected.key === val.key;
      }

      if (!isSelected) addSelectedValue(val);
      else removeSelectedValue(val);
    };

    const handleKey = (e: KeyboardEvent) => {
      if (!visible.value) toggle();

      switch (e.key) {
        case 'Down':
        case 'ArrowDown':
          optionHoveredIndex.value = getNextVisibleOptionIndex();

          if (optionHoveredIndex.value !== -1) {
            optionHovered.value = options[optionHoveredIndex.value].key;
          }
          break;

        case 'Up':
        case 'ArrowUp':
          optionHoveredIndex.value = getPreviousVisibleOptionIndex();
          if (optionHoveredIndex.value !== -1) {
            optionHovered.value = options[optionHoveredIndex.value].key;
          }
          break;

        case 'Enter':
          if (optionHoveredIndex.value < 0) return;
          handleSelectedValue(options[optionHoveredIndex.value]);

          if (!props.multiple) {
            close();
          }

          break;

        case 'Esc':
        case 'Escape':
          close();
          break;
        default:
      }
    };

    // Permite a los UiOption acceder a los props, ya que al ser slots no pueden recibirlos
    // Pasando funciones por Provide permite actualizar data del Select, al no poder escuchar eventos
    provide('addOption', addOption);
    provide('removeOption', removeOption);
    provide('addOptionCount', addOptionCount);
    provide('substractOptionCount', substractOptionCount);
    provide('handleSelectedValue', handleSelectedValue);
    provide('value', computed(() => props.value));
    provide('inputValue', computed(() => inputValue.value));
    provide('hovered', computed(() => optionHovered.value));
    provide('filterable', props.filterable);

    onMounted(() => {
      filteredOptionsCount.value = options.length;

      if (!props.value) {
        return;
      }

      if (props.multiple && Array.isArray(props.value)) {
        props.value.forEach((v: any) => {
          options.forEach(o => {
            if (o.value === v || o.value[props.valueKey] === v) {
              addSelectedValue(o);
            }
          });
        });

        return;
      }

      options.some(o => {
        if (o.value === props.value || o.value[props.valueKey] === props.value) {
          addSelectedValue(o);
          return true;
        }

        return false;
      });
    });

    if (typeof formValidators === 'function' && typeof props.validator === 'function') {
      formValidators(props.validator);
    }

    return {
      visible,
      inputValue,
      error,
      currentPlaceholder,
      cachedCurrentPlaceholder,
      selected,
      options,
      optionHovered,
      optionHoveredIndex,
      isDisabled,
      inputSize,
      inputValidateOn,
      filteredOptionsCount,
      emptyText,
      hasPrepend,
      addOption,
      removeOption,
      addOptionCount,
      substractOptionCount,
      addSelectedValue,
      removeSelectedValue,
      clearSelectedValues,
      toggle,
      close,
      showCreatedOption,
      formDisabled,
      formSize,
      formValidateOn,
      formValidators,
      handleInput,
      handleChange,
      debouncedHandleInput,
      debouncedHandleChange,
      handleKey,
      getNextVisibleOptionIndex,
      getPreviousVisibleOptionIndex,
    };
  },
});
</script>
