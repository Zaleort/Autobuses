<template>
  <div class="table__wrapper">
    <table
      :class="{
        'table': true,
        [`table--${size}`]: true,
        'table--stripe': stripe,
      }"
    >
      <thead>
        <th
          v-for="(h, index) of headings"
          :key="index"
          :class="{
            'table__heading': true,
            [`table__heading--${size}`]: true,
            'clickable': h.sortable,
          }"
          :style="{
            width: h.width + 'px',
            textAlign: h.align,
          }"
          @click="h.sortable ? direction = null : null"
        >
          <div class="table__heading-cell">
            {{ h.name }}
            <div v-if="h.sortable" class="table__order">
              <ui-icon
                icon="angleUp"
                size="mini"
                class="clickable ml-3"
                :class="{ 'text-primary': direction === 'ascendent' && sortedProp === h.prop }"
                @click.stop="order(h, 'ascendent')"
              />
              <ui-icon
                icon="angleDown"
                size="mini"
                class="clickable ml-3"
                :class="{ 'text-primary': direction === 'descendent' && sortedProp === h.prop }"
                @click.stop="order(h, 'descendent')"
              />
            </div>
          </div>
        </th>
      </thead>
      <tbody class="table__body">
        <slot />
      </tbody>
    </table>

    <span v-if="emptyText && (!items || items.length === 0)" class="table__empty-text">
      {{ emptyText }}
    </span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, PropType, provide, ref,
} from 'vue';
import UiIcon from '@/components/ui/UiIcon.vue';

export default defineComponent({
  name: 'UiTable',
  components: {
    UiIcon,
  },

  props: {
    headings: {
      type: Array as PropType<UiTableHeading[]>,
      required: true,
    },

    items: {
      type: Array as PropType<any[]>,
      default: null,
    },

    sortMethod: {
      type: Function as PropType<UiTableSortMethod>,
      default: null,
    },

    size: {
      type: String,
      default: 'normal',
    },

    stripe: {
      type: Boolean,
      default: false,
    },

    emptyText: {
      type: String,
      default: null,
    },
  },

  emits: ['sort', 'update:items'],

  setup(props, context) {
    provide('tableSize', props.size);

    const direction = ref<string | null>(null);
    const sortedProp = ref<string>('');
    const innerItems = ref(props.items);

    const checkType = (propName: string) => {
      if (!props.items || typeof props.items[0][propName] === 'undefined') {
        return undefined;
      }

      const prop = props.items[0][propName];

      if (typeof prop === 'string') return 'string';
      if (typeof prop === 'number' && !isNaN(prop)) return 'number';
      if (typeof prop === 'object') return 'object';

      return null;
    };

    const sortAsc = (x: any, y: any) => {
      const a = x[sortedProp.value];
      const b = y[sortedProp.value];
      const type = checkType(sortedProp.value);
      if (type === 'number') {
        if (a > b) return 1;
        if (a < b) return -1;
        if (a === b) return 0;
      }

      if (type === 'string') {
        return a.localeCompare(b);
      }

      if (type === 'object') {
        return a.toString().localeCompare(b.toString());
      }

      return 0;
    };

    const sortDesc = (x: any, y: any) => {
      const a = x[sortedProp.value];
      const b = y[sortedProp.value];
      const type = checkType(sortedProp.value);
      if (type === 'number') {
        if (a > b) return -1;
        if (a < b) return 1;
        if (a === b) return 0;
      }

      if (type === 'string') {
        return b.localeCompare(a);
      }

      if (type === 'object') {
        return b.toString().localeCompare(a.toString());
      }

      return 0;
    };

    const order = (item: UiTableHeading, _direction: string) => {
      direction.value = _direction;
      sortedProp.value = item.prop;

      if (!props.items || props.items.length === 0 || typeof props.items[0][item.prop] === 'undefined') {
        return;
      }

      if (typeof props.sortMethod === 'function') {
        context.emit('sort', props.sortMethod(item.prop, _direction));
        return;
      }

      if (_direction === 'ascendent') {
        innerItems.value.sort(sortAsc);
        context.emit('sort', innerItems.value);
      } else if (_direction === 'descendent') {
        innerItems.value.sort(sortDesc);
        context.emit('sort', innerItems.value);
      }
    };

    return {
      direction,
      sortedProp,
      sortAsc,
      sortDesc,
      order,
    };
  },
});
</script>
