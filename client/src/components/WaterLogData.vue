<template>
  <v-container>
    <!--
      /**
      * Author: Tautvydas Dikšas
      * Date: 2022-05-10
      * Path: src/components/WaterLogData
      *
      */
     -->
    <v-container class="d-flex">
      <h1 class="display-1 primary--text">
        <v-icon
          large
          color="primary"
        >
          mdi-cup-water
        </v-icon>
        Water logging
      </h1>
      <v-spacer></v-spacer>
      <water-modal @water-log-save="createLog">
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
          >
            Log water
          </v-btn>
        </template>
      </water-modal>
    </v-container>
    <v-data-table
      :headers="waterHeaders"
      :items="waterLogs"
    >
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>
      <template #item.actions="{ item, index }">
        <water-modal
          ref="water-modal"
          isEdit
          @water-log-edit="saveEdit"
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
              @click="removeWaterLog(item)"
            >
              Remove
            </v-btn>
          </template>
        </water-modal>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import user from '../services/user';
import waterModal from './WaterLogModal.vue';

export default {
  components: {
    waterModal,
  },
  data: () => ({
    user,
    waterLogs: [],
    waterHeaders: [
      { text: '', value: 'index' },
      { text: 'Amount (ml)', value: 'amount' },
      { text: 'Logged at', value: 'loggedAt' },
      { text: '', value: 'actions' },
    ],
  }),
  created() {
    this.loadWaterLogs();
  },
  methods: {
    loadWaterLogs() {
      return this.user.getWaterLogs().then(({ data }) => {
        this.waterLogs = data.waterLogs;
      });
    },
    openEdit(item, index) {
      const dateVal = item.loggedAt.split(' ');
      this.$refs['water-modal'].handleEdit({
        index,
        id: item.id,
        amount: item.amount,
        loggedAtDate: dateVal[0],
        loggedAtTime: dateVal[1],
      });
    },
    removeWaterLog(item) {
      return this.user.removeWaterLog(item.id).then(() => {
        this.waterLogs = this.waterLogs.filter((w) => w.id !== item.id);
      });
    },
    createLog(item) {
      const bodyData = {
        amount: item.amount,
      };
      const loggedAt = item.loggedAtDate ? `${item.loggedAtDate}T${item.loggedAtTime}` : '';
      if (loggedAt) {
        bodyData.loggedAt = loggedAt;
      }
      return this.user.createWaterLog(bodyData).then(({ data }) => {
        this.waterLogs.push(data.waterLog);
      });
    },
    saveEdit(item) {
      const bodyData = {
        amount: item.amount,
      };
      const loggedAt = item.loggedAtDate ? `${item.loggedAtDate}T${item.loggedAtTime}` : '';
      if (loggedAt) {
        bodyData.loggedAt = loggedAt;
      }
      return this.user.editWaterLog(item.id, bodyData).then(({ data }) => {
        this.waterLogs.forEach((log, index) => {
          if (log.id !== data.waterLog.id) return;
          this.$set(this.waterLogs, index, data.waterLog);
        });
      });
    },
  },
};
</script>
