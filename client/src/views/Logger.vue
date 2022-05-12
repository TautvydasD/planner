<template>
  <v-container class="justify-center">
    <!--
      /**
      * Author: Tautvydas Dikšas
      * Date: 2022-05-10
      * Path: src/views/Logger
      *
      */
     -->
    <v-card>
      <v-tabs
        v-model="tab"
        centered
      >
        <v-tabs-slider :color="tabColors[tab]"></v-tabs-slider>
        <v-tab
          v-for="tabber in tabs"
          :key="tabber"
          :active-class="`${tabColors[tab]}--text`"
        >
          {{ tabber }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="tabber in tabs"
          :key="tabber"
        >
          <v-card flat>
            <component :is="getComponent(tabber)" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import Water from '../components/WaterLogData.vue';
import Weight from '../components/WeightLogData.vue';

export default {
  components: {
    Water,
    Weight,
  },
  data: () => ({
    tabs: ['Water', 'Weight'],
    tabColors: ['primary', 'orange'],
    tab: 'Water',
    waterLogs: [],
    waterHeaders: [
      { text: '', value: '' },
      { text: 'Amount', value: 'amount' },
      { text: 'Logged at', value: 'loggedAt' },
      { text: '', value: 'actions' },
    ],
  }),
  methods: {
    getComponent(component) {
      return component;
    },
  },
};
</script>
