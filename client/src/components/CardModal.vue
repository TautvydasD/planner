<template>
  <v-dialog width="800">
    <template #activator="{ on, attrs }">
      <slot name="content" :on="on" :attrs="attrs" />
    </template>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>
