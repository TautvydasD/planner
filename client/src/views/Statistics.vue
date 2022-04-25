<template>
  <v-container>
    <!-- Dashboard
    <button @click="test()">fitbit</button>
    <router-link :to="fitbit">Go to Home</router-link> -->
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
      >
        <v-card>
          <v-card-subtitle
            style="padding-bottom: 0"
          >
            Body Mass Index (BMI)
          </v-card-subtitle>
          <v-card-text class="d-flex">
            <v-container class="d-flex align-center">
              <v-progress-circular
                v-if="bmi.bmi"
                :rotate="180"
                :size="100"
                :width="15"
                :value="100"
                :color="bmiInfo[bmi.status].color"
              >
                {{ bmi.bmi }}
              </v-progress-circular>
              <span
                v-else
              >
                Missing data
              </span>
            </v-container>
            <v-container class="d-flex flex-column">
              <v-tooltip
                v-for="(hint, name) in bmiInfo"
                :key="name"
                right
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    x-small
                    :color="hint.color"
                    v-bind="attrs"
                    v-on="on"
                    class="my-1"
                    depressed
                  />
                </template>
                <span>{{ hint.text }}</span>
              </v-tooltip>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="5"
        md="3"
        lg="2"
      >
        <v-card>
          <v-card-subtitle>Water goals</v-card-subtitle>
          <v-card-text
            class="d-flex">
            <v-container class="d-flex align-center">
              <v-progress-circular
                :rotate="180"
                :size="100"
                :width="15"
                :value="100"
                color="primary"
              >
              </v-progress-circular>
              <!-- <span
                v-else
              >
                Missing data
              </span> -->
            </v-container>
            <v-container class="d-flex flex-column">
              <v-btn
                x-small
                text
              >
                Today
              </v-btn>
              <v-btn
                x-small
                text
              >
                Yesterday
              </v-btn>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="5"
        md="3"
        lg="2"
      >
        <v-card>
          <v-card-subtitle>Calorie intake goals</v-card-subtitle>
          <v-card-text
            class="d-flex">
            <v-container class="d-flex align-center">
              <v-progress-circular
                :rotate="180"
                :size="100"
                :width="15"
                :value="100"
                color="green"
              >
              </v-progress-circular>
              <!-- <span
                v-else
              >
                Missing data
              </span> -->
            </v-container>
            <v-container class="d-flex flex-column">
              <v-btn
                x-small
                text
              >
                Today
              </v-btn>
              <v-btn
                x-small
                text
              >
                Yesterday
              </v-btn>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="5"
        md="3"
        lg="2"
      >
        <v-card>
          <v-card-subtitle>Event creation statistics</v-card-subtitle>
          <v-card-text>
            <v-container>
              <bar-chart v-if="loaded" :chart-data="eventMonthlyChartData" />
            </v-container>
            <v-container>
              Overall
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="5"
        md="3"
        lg="2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="eventTodayChartData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- <v-flex
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-card>
        <v-card-subtitle
          style="padding-bottom: 0"
        >
          Body Mass Index (BMI)
        </v-card-subtitle>
        <v-card-text class="d-flex">
          <v-container class="d-flex align-center">
            <v-progress-circular
              v-if="bmi.bmi"
              :rotate="180"
              :size="100"
              :width="15"
              :value="100"
              :color="bmiInfo[bmi.status].color"
            >
              {{ bmi.bmi }}
            </v-progress-circular>
            <span
              v-else
            >
              Missing data
            </span>
          </v-container>
          <v-container>
            <v-tooltip
              v-for="(hint, name) in bmiInfo"
              :key="name"
              right
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  x-small
                  :color="hint.color"
                  v-bind="attrs"
                  v-on="on"
                  class="my-1"
                  depressed
                />
              </template>
              <span>{{ hint.text }}</span>
            </v-tooltip>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex> -->
    <!-- <v-flex
      v-if="device.deviceVersion"
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-dialog
        width="600"
      >
        <template #activator="{ on, attrs }">
          <v-card
            v-bind="attrs"
            v-on="on"
          >
            <v-img :src="require(`../assets/${device.path}.png`)" />
            <v-card-text>{{ device.deviceVersion }} - {{ device.batteryLevel }}%</v-card-text>
          </v-card>
        </template>
        <v-card>
          <v-card-title>
            {{ device.deviceVersion }}
          </v-card-title>
          <v-card-text>{{ device }}</v-card-text>
        </v-card>
      </v-dialog>
    </v-flex> -->
    <!-- v-if="friends" -->
    <v-flex
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-card>
        <v-card-text>
          <bar-chart v-if="loaded" :chart-data="eventMonthlyChartData" />
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-card>
        <v-card-text>
          <bar-chart v-if="loaded" :chart-data="eventTodayChartData" />
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-card>
        <v-card-text>
          <bar-chart v-if="loaded" :chart-data="eventOverallChartData" />
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-card>
        <v-card-text>
          <bar-chart v-if="loaded" :chart-data="eventCurrentWeekChartData" />
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      xs12
      sm5
      md3
      lg2
      class="ma-2"
    >
      <v-card>
        <v-card-text>
          <bar-chart v-if="loaded" :chart-data="eventPreviousWeekChartData" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-container>
</template>

<script>
import user from '../services/user';
import BarChart from './BarChart.vue';

export default {
  components: {
    BarChart,
  },
  data() {
    return {
      loaded: false,
      weight: 130,
      height: 180,
      fitbit: 'https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22C643&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhealth%2Fsleep&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800',
      device: {},
      friends: null,
      eventMonthlyChartData: null,
      eventTodayChartData: null,
      eventOverallChartData: null,
      eventCurrentWeekChartData: null,
      eventPreviousWeekChartData: null,
      bmi: {},
      bmiInfo: {
        obesity: {
          color: 'red',
          text: 'Obesity weight range, when your BMI is 30.0 or higher',
        },
        overweight: {
          color: 'orange',
          text: 'Overweight weight range, when your BMI is between 25.0 and <30',
        },
        healthy: {
          color: 'green',
          text: 'Healthy weight range, when your BMI is between 18.5 and <25',
        },
        underweight: {
          color: 'blue',
          text: 'Underweight weight range, when your BMI is less than 18.5',
        },
      },
    };
  },
  created() {
    this.loadStatistics();
  },
  methods: {
    async loadStatistics() {
      // data.forEach((o) => {
      //   if (o.devices) {
      //     const [device] = o.devices;
      //     this.device = {
      //       path: device.deviceVersion.toLowerCase().replace(/ /g, '_'),
      //       ...device,
      //     };
      //     console.log(this.device);
      //   }
      //   if (o.friends) {
      //     this.friends = o.friends;
      //   }
      // });
      try {
        const { data } = await user.getStatistics();
        console.log(data);
        this.eventMonthlyChartData = this.getDataSet(data.events.monthly, '#1976d2', 'Events created every month');
        this.eventTodayChartData = this.getDataSet([['Today', data.events.today]], 'grey', 'Events created today');
        this.eventOverallChartData = this.getDataSet([['Overall', data.events.overall]], 'grey', 'Events created overall');
        this.eventCurrentWeekChartData = this.getDataSet(data.events.currentWeek, 'pink', 'Events created this week');
        this.eventPreviousWeekChartData = this.getDataSet(data.events.previousWeek, 'pink', 'Events created previous week');
        this.bmi = data.bmi;
        this.loaded = true;
      } catch (error) {
        console.error(error);
      }
    },
    getDataSet(arr, backgroundColor, label) {
      return {
        labels: arr.map((e) => e[0]),
        datasets: [
          {
            label,
            backgroundColor,
            data: arr.map((e) => e[1]),
          },
        ],
      };
    },
    test() {
      window.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=2385GX&redirect_uri=http%3A%2F%2Flocalhost%3A8080&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800';
    },
  },
};
</script>
