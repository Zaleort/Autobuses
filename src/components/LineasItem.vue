<template>
  <div class="card p-1">
    <div class="card-header linea-card-header">
      <router-link class="linea-card-name capitalize" :to="{ name: 'Linea', params: { id: linea._id } }">
        Línea {{ linea.name }} - {{ recorrido }}
      </router-link>
      <div class="icon fav-icon">
        <svg
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path fill="#bdbdbd" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z" />
        </svg>
      </div>
    </div>
    <div v-if="nucleos" class="linea-card-nucleos">
      <span class="capitalize">{{ nucleosNames.toLowerCase() }}</span>
    </div>
    <div class="linea-card-footer">
      <span v-if="linea.accesible" class="accesible">
        <svg
          class="icon accesible-icon"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path fill="#bdbdbd" d="M496.101 385.669l14.227 28.663c3.929 7.915.697 17.516-7.218 21.445l-65.465 32.886c-16.049 7.967-35.556 1.194-43.189-15.055L331.679 320H192c-15.925 0-29.426-11.71-31.679-27.475C126.433 55.308 128.38 70.044 128 64c0-36.358 30.318-65.635 67.052-63.929 33.271 1.545 60.048 28.905 60.925 62.201.868 32.933-23.152 60.423-54.608 65.039l4.67 32.69H336c8.837 0 16 7.163 16 16v32c0 8.837-7.163 16-16 16H215.182l4.572 32H352a32 32 0 0 1 28.962 18.392L438.477 396.8l36.178-18.349c7.915-3.929 17.517-.697 21.446 7.218zM311.358 352h-24.506c-7.788 54.204-54.528 96-110.852 96-61.757 0-112-50.243-112-112 0-41.505 22.694-77.809 56.324-97.156-3.712-25.965-6.844-47.86-9.488-66.333C45.956 198.464 0 261.963 0 336c0 97.047 78.953 176 176 176 71.87 0 133.806-43.308 161.11-105.192L311.358 352z" />
        </svg>
      </span>
      <div class="tooltip">
        Accesible para personas con discapacidad
      </div>
      <span class="paradas">
        <svg
          class="icon bus-icon"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path fill="#bdbdbd" d="M488 128h-8V80c0-44.8-99.2-80-224-80S32 35.2 32 80v48h-8c-13.25 0-24 10.74-24 24v80c0 13.25 10.75 24 24 24h8v160c0 17.67 14.33 32 32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h192v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32h6.4c16 0 25.6-12.8 25.6-25.6V256h8c13.25 0 24-10.75 24-24v-80c0-13.26-10.75-24-24-24zM112 400c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm16-112c-17.67 0-32-14.33-32-32V128c0-17.67 14.33-32 32-32h256c17.67 0 32 14.33 32 32v128c0 17.67-14.33 32-32 32H128zm272 112c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z" />
        </svg>
        {{ linea.paradasInfo.length }}
      </span>
      <div class="tooltip">
        Paradas: {{ linea.paradasInfo.length }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import { ApiLinea } from '@/interfaces/apiResponses';

export default defineComponent({
  name: 'LineasItem',
  components: {

  },

  props: {
    linea: {
      type: Object as PropType<ApiLinea>,
      default: null,
    },

    nucleos: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
  },

  setup(props) {
    const nucleosNames = computed(() => props.nucleos.join(', '));
    const recorrido = computed(() => {
      const salida = props.nucleos[0].toLocaleLowerCase();
      const destino = props.nucleos[props.nucleos.length - 1].toLocaleLowerCase();
      return `${salida} - ${destino}`;
    });

    return {
      nucleosNames,
      recorrido,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/variables';

.linea-card-header {
    align-items: baseline;
    justify-content: space-between;

    @include mobile-l {
        align-items: center;
    }
}

.linea-card-name {
    color: $text;
    display: block;
    font-weight: 400;
    text-decoration: none;
    transition: all 0.15s;

    &:hover {
        color: $primary;
    }

    @include mobile-l {
        font-weight: 500;
        font-size: 1.1em;
    }

    @include tablet {
        font-size: 1.25em;
    }
}

.linea-card-nucleos {
    margin: 9px 0;
}

.linea-card-footer {
    position: relative;
    font-size: 0.8em;
    color: $grey500;
    display: flex;
    justify-content: flex-end;
}

.fav-icon {
    margin-left: 9px;
    width: 21px;
}

.bus-icon, .accesible-icon {
    margin-left: 9px;
    width: 16px;
}

.accesible, .paradas {
    &:hover {
        color: $grey700;
    }

    &:hover + .tooltip {
        visibility: visible;
    }

    &:hover svg path {
        fill: $grey700;
    }
}

</style>