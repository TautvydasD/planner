<template>
  <v-container>
    <!--
      /**
        * Author: Tautvydas Dikšas
        * Date: 2022-05-10
        * Path: src/components/WeightLogData
        *
        */
     -->
    <v-container class="d-flex">
      <h1 class="display-1 orange--text">
        <v-icon
          color="orange"
          large
        >
          mdi-scale-bathroom
        </v-icon>
        Weight logging
      </h1>
      <v-spacer></v-spacer>
      <weight-modal
        @weight-log-save="createLog"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            Log weight
          </v-btn>
        </template>
      </weight-modal>
    </v-container>
    <v-data-table
      :headers="weightHeaders"
      :items="weightLogs"
    >
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>
      <template #item.actions="{ item, index }">
        <weight-modal
          ref="weight-modal"
          isEdit
          @weight-log-edit="saveEdit"
        >
          <template #activator>
            <v-btn
              color="green"
              text
              @click="openEdit(item, index)"
            >
              Edit
            </v-btn>
            <v-btn
              color="red"
              text
              @click="removeWeightLog(item)"
            >
              Remove
            </v-btn>
          </template>
        </weight-modal>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import user from '../services/user';
import weightModal from './WeightLogModal.vue';

export default {
  components: {
    weightModal,
  },
  data: () => ({
    weightLogs: [],
    weightHeaders: [
      { text: '', value: 'index' },
      { text: 'Weight (kg)', value: 'weight' },
      { text: 'Body fat (%)', value: 'bodyFat' },
      { text: 'Logged at', value: 'loggedAt' },
      { text: '', value: 'actions' },
    ],
  }),
  created() {
    this.loadWeightLogs();
  },
  methods: {
    loadWeightLogs() {
      return user.getWeightLogs().then(({ data }) => {
        this.weightLogs = data.weightLogs;
      });
    },
    openEdit(item, index) {
      const dateVal = item.loggedAt.split(' ');
      this.$refs['weight-modal'].handleEdit({
        index,
        id: item.id,
        weight: item.weight,
        bodyFat: item.bodyFat,
        loggedAtDate: dateVal[0],
        loggedAtTime: dateVal[1],
      });
    },
    removeWeightLog(item) {
      return user.removeWeightLog(item.id).then(() => {
        this.weightLogs = this.weightLogs.filter((w) => w.id !== item.id);
      });
    },
    createLog(item) {
      const bodyData = {
        weight: item.weight,
        bodyFat: item.bodyFat,
      };
      const loggedAt = item.loggedAtDate ? `${item.loggedAtDate}T${item.loggedAtTime}` : '';
      if (loggedAt) {
        bodyData.loggedAt = loggedAt;
      }
      return user.createWeightLog(bodyData).then(({ data }) => {
        this.weightLogs.push(data.weightLog);
      });
    },
    saveEdit(item) {
      const bodyData = {
        weight: item.weight,
        bodyFat: item.bodyFat,
      };
      const loggedAt = item.loggedAtDate ? `${item.loggedAtDate}T${item.loggedAtTime}` : '';
      if (loggedAt) {
        bodyData.loggedAt = loggedAt;
      }
      return user.editWeightLog(item.id, bodyData).then(({ data }) => {
        this.weightLogs.forEach((log, index) => {
          if (log.id !== data.weightLog.id) return;
          this.$set(this.weightLogs, index, data.weightLog);
        });
      });
    },
  },
};
</script>
