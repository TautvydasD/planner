<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="5"
        md="3"
        lg="2"
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
          <v-card-text class="d-flex">
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
            <v-container
              class="d-flex flex-column"
            >
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
          <v-card-subtitle>Weight latest</v-card-subtitle>
          <v-card-text class="d-flex">
            <v-container class="d-flex align-center">
              <v-progress-circular
                :rotate="180"
                :size="100"
                :width="15"
                :value="100"
                color="orange"
              >
              </v-progress-circular>
              <!-- <span
                v-else
              >
                Missing data
              </span> -->
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        v-if="friends"
        cols="12"
        sm="5"
        md="3"
        lg="2"
      >
        <v-card>
          <v-card-subtitle>Friends</v-card-subtitle>
          <v-card-text class="d-flex">
            <v-container class="d-flex align-center">
              <v-progress-circular
                :rotate="180"
                :size="100"
                :width="15"
                :value="100"
                color="green"
              >
                {{ friends.length }}
              </v-progress-circular>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- <v-col
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
      </v-col> -->
      <v-col
        v-if="device.deviceVersion"
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
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
              <v-img src="../assets/generic_watch.jpg" />
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
      </v-col>
    </v-row>
    <v-row>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="eventMonthlyChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="eventTodayChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="eventOverallChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="eventCurrentWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="eventPreviousWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <!-- water log -->
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="waterMonthlyChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="waterTodayChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="waterOverallChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="waterCurrentWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="waterPreviousWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <!-- workouts -->
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="workoutMonthlyChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="workoutTodayChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="workoutOverallChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="workoutCurrentWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="workoutPreviousWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Exercise -->
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="exerciseMonthlyChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="exerciseTodayChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="exerciseOverallChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="exerciseCurrentWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="exercisePreviousWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Weight logs -->
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="weightMonthlyChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="weightTodayChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="weightOverallChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="weightCurrentWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        xs12
        sm5
        md3
        lg2
        cols="12"
        sm="5"
        md="3"
        lg="2"
        class="ma-2"
      >
        <v-card>
          <v-card-text>
            <bar-chart v-if="loaded" :chart-data="weightPreviousWeekChartData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
      // events
      eventMonthlyChartData: null,
      eventTodayChartData: null,
      eventOverallChartData: null,
      eventCurrentWeekChartData: null,
      eventPreviousWeekChartData: null,
      // waterlogs
      waterMonthlyChartData: null,
      waterTodayChartData: null,
      waterOverallChartData: null,
      waterCurrentWeekChartData: null,
      waterPreviousWeekChartData: null,
      waterTimeChart: {},
      // workout
      workoutMonthlyChartData: null,
      workoutTodayChartData: null,
      workoutOverallChartData: null,
      workoutCurrentWeekChartData: null,
      workoutPreviousWeekChartData: null,
      workoutTimeChart: {},
      // exercises
      exerciseMonthlyChartData: null,
      exerciseTodayChartData: null,
      exerciseOverallChartData: null,
      exerciseCurrentWeekChartData: null,
      exercisePreviousWeekChartData: null,
      exerciseTimeChart: {},
      // weight logs
      weightMonthlyChartData: null,
      weightTodayChartData: null,
      weightOverallChartData: null,
      weightCurrentWeekChartData: null,
      weightPreviousWeekChartData: null,
      weightTimeChart: {},
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
        this.eventTimeChart = {
          currentValue: 'today',
          monthly: this.getDataSet(data.events.monthly, '#1976d2', 'Events created every month'),
          today: this.getDataSet([['Today', data.events.today]], 'grey', 'Events created today'),
          overall: this.getDataSet([['Overall', data.events.overall]], 'grey', 'Events created overall'),
          currentWeek: this.getDataSet(data.events.currentWeek, 'pink', 'Events created this week'),
          previousWeek: this.getDataSet(data.events.previousWeek, 'pink', 'Events created previous week'),
        };
        if (data.devices) {
          [this.device] = data.devices;
        }
        if (data.friends) {
          this.friends = data.friends;
        }
        // events
        this.eventMonthlyChartData = this.getDataSet(data.events.monthly, 'pink', 'Events created every month');
        this.eventTodayChartData = this.getDataSet([['Today', data.events.today]], 'pink', 'Events created today');
        this.eventOverallChartData = this.getDataSet([['Overall', data.events.overall]], 'pink', 'Events created overall');
        this.eventCurrentWeekChartData = this.getDataSet(data.events.currentWeek, 'pink', 'Events created this week');
        this.eventPreviousWeekChartData = this.getDataSet(data.events.previousWeek, 'pink', 'Events created previous week');
        // water log
        this.waterMonthlyChartData = this.getDataSet(data.waterLogs.monthly, 'blue', 'Water logs created every month');
        this.waterTodayChartData = this.getDataSet([['Today', data.waterLogs.today]], 'blue', 'Water logs created today');
        this.waterOverallChartData = this.getDataSet([['Overall', data.waterLogs.overall]], 'blue', 'Water logs created overall');
        this.waterCurrentWeekChartData = this.getDataSet(data.waterLogs.currentWeek, 'blue', 'Water logs created this week');
        this.waterPreviousWeekChartData = this.getDataSet(data.waterLogs.previousWeek, 'blue', 'Water logs created previous week');
        // workout
        this.workoutMonthlyChartData = this.getDataSet(data.workouts.monthly, 'green', 'Workouts created every month');
        this.workoutTodayChartData = this.getDataSet([['Today', data.workouts.today]], 'green', 'Workouts created today');
        this.workoutOverallChartData = this.getDataSet([['Overall', data.workouts.overall]], 'green', 'Workouts created overall');
        this.workoutCurrentWeekChartData = this.getDataSet(data.workouts.currentWeek, 'green', 'Workouts created this week');
        this.workoutPreviousWeekChartData = this.getDataSet(data.workouts.previousWeek, 'green', 'Workouts created previous week');
        // exercises
        this.exerciseMonthlyChartData = this.getDataSet(data.exercises.monthly, 'grey', 'Exercises created every month');
        this.exerciseTodayChartData = this.getDataSet([['Today', data.exercises.today]], 'grey', 'Exercises created today');
        this.exerciseOverallChartData = this.getDataSet([['Overall', data.exercises.overall]], 'grey', 'Exercises created overall');
        this.exerciseCurrentWeekChartData = this.getDataSet(data.exercises.currentWeek, 'grey', 'Exercises created this week');
        this.exercisePreviousWeekChartData = this.getDataSet(data.exercises.previousWeek, 'grey', 'Exercises created previous week');
        // weight
        this.weightMonthlyChartData = this.getDataSet(data.weightLogs.monthly, 'yellow', 'Weight logs created every month');
        this.weightTodayChartData = this.getDataSet([['Today', data.weightLogs.today]], 'yellow', 'Weight logs created today');
        this.weightOverallChartData = this.getDataSet([['Overall', data.weightLogs.overall]], 'yellow', 'Weight logs created overall');
        this.weightCurrentWeekChartData = this.getDataSet(data.weightLogs.currentWeek, 'yellow', 'Weight logs created this week');
        this.weightPreviousWeekChartData = this.getDataSet(data.weightLogs.previousWeek, 'yellow', 'Weight logs created previous week');
        // bmi
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
