<template>
  <v-container>
    <v-divider style="margin-top: 12px;" />
      <div class="d-flex">
        <h1 class="subheading justify-center grey--text my-3">
          {{ title }}
        </h1>
        <v-spacer></v-spacer>
        <slot name="header" />
      </div>
    <v-divider style="margin-bottom: 12px;" />
    <v-sheet>
      <v-slide-group
        v-if="loaded"
        show-arrows
        class="justify-center"
      >
        <v-slide-item
          v-if="hasAdd"
          key="create"
        >
          <slot name="create" />
        </v-slide-item>
        <v-slide-item
          v-for="(item, index) in source"
          :key="index"
        >
          <slot :item="item" />
        </v-slide-item>
      </v-slide-group>
      <v-slide-group
        v-else
        show-arrows
        class="justify-center"
      >
        <v-slide-item
          v-for="(_, index) in source"
          :key="`skeleton-${index}`"
        >
          <v-skeleton-loader
            type="card"
            elevation="2"
            class="ma-2"
            width="300"
            height="250"
          />
        </v-slide-item>
      </v-slide-group>
    </v-sheet>
  </v-container>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    hasAdd: {
      type: Boolean,
      default: false,
    },
    instances: {
      type: Array,
      required: true,
    },
    loaded: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    source() {
      return this.loaded ? this.instances : [{}, {}, {}, {}, {}, {}];
    },
  },
};
</script>
