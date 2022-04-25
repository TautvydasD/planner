<template>
  <v-container
    class="justify-center"
  >
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
      <v-tabs-items
        v-model="tab"
      >
        <v-tab-item
          v-for="tabber in tabs"
          :key="tabber"
        >
          <v-card
            flat
          >
            <component :is="getComponent(tabber)" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import Water from '../components/WaterLogData.vue';
import Food from '../components/FoodLogData.vue';
import Weight from '../components/WeightLogData.vue';
import user from '../services/user';

export default {
  components: {
    Water,
    Food,
    Weight,
  },
  data: () => ({
    tabs: ['Water', 'Food', 'Weight'],
    tabColors: ['primary', 'green', 'orange'],
    tab: 'Water',
    waterLogs: [],
    waterHeaders: [
      { text: '', value: '' },
      { text: 'Amount', value: 'amount' },
      { text: 'Logged at', value: 'loggedAt' },
      { text: '', value: 'actions' },
    ],
  }),
  created() {
    this.loadWaterLogs();
  },
  methods: {
    loadWaterLogs() {
      return user.getWaterLogs().then(({ data }) => {
        this.waterLogs = data.waterLogs;
      });
    },
    removeWaterLog(item) {
      this.waterLogs = this.waterLogs.filter((w) => w.id !== item.id);
    },
    getComponent(component) {
      return component;
    },
  },
};
</script>
