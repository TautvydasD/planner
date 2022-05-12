<template>
  <v-dialog
    v-model="showModal"
    width="600"
    :retain-focus="false"
    @click:outside="resetForm"
  >
    <template
      v-if="isAdd"
      #activator="{ on, attrs }"
    >
      <slot
        :on="on"
        :attrs="attrs"
        name="activator"
      />
    </template>
    <v-card v-if="showForm">
      <v-card-title>
        <span clas="text-h5">{{ isEdit ? 'Update' : 'Create new' }} event</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                label="Name"
                hint="The name of your activity"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.description"
                label="Description"
                hint="Describe your activity"
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.type"
                label="Type"
                :items="defaultEventTypes"
              />
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="startDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.startDate"
                    label="Start date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="form.startDate"
                  no-title
                  first-day-of-week="1"
                  @input="startDateMenu = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                ref="startTimeMenu"
                v-model="startTimeMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.startTime"
                    label="Start time"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="startTimeMenu"
                  v-model="form.startTime"
                  no-title
                  format="24hr"
                  @click:minute="$refs.startTimeMenu.save(form.startTime)"
                />
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                v-model="endDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.endDate"
                    label="End date"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="form.endDate"
                  no-title
                  first-day-of-week="1"
                  @input="endDateMenu = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="6">
              <v-menu
                ref="endTimeMenu"
                v-model="endTimeMenu"
                :close-on-content-click="false"
                :return-value.sync="form.endTime"
                transition="scale-transition"
                offset-y
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.endTime"
                    label="End time"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-if="endTimeMenu"
                  v-model="form.endTime"
                  no-title
                  format="24hr"
                  @click:minute="$refs.endTimeMenu.save(form.endTime)"
                />
              </v-menu>
            </v-col>
            <v-col
              v-if="form.type === 'workout'"
              cols="12"
              xs="12"
            >
              Workout
              <workout-modal
                v-if="form.workoutId"
                :workout="getWorkout(form.workoutId)"
                :exercises="exercises"
                custom
              >
                <template #custom="{ on, attrs }">
                  <v-card xs8>
                    <v-card-title>
                      <v-icon>mdi-basketball</v-icon>
                      <div class="grey--text card-title-name-spacing">
                        {{ getWorkout(form.workoutId).name }}
                      </div>
                      <v-spacer />
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        icon
                        text
                        color="primary"
                      >
                        <v-icon>mdi-information-outline</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        text
                        color="green"
                      >
                        <v-icon>mdi-swap-horizontal</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        text
                        color="error"
                        @click="removeWorkout"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </v-card-title>
                  </v-card>
                </template>
              </workout-modal>
              <v-dialog
                v-else
                v-model="workoutDialog"
                width="800"
              >
                <template #activator="{ on, attrs }">
                  {{ workouts.myExercises }}
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    height="50"
                    width="100%"
                    outlined
                    color="primary"
                    cols="12"
                  >
                    <div class="button-content-wrapper">
                      <v-icon color="primary">
                        mdi-plus
                      </v-icon>
                      Add Workout
                    </div>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    Workouts
                  </v-card-title>
                  <v-card-text>
                    <span class="subtitle-1">My workouts</span>
                    <v-layout>
                      <!-- {{ workouts }} -->
                      <card-table
                        :instances="workouts.myWorkouts"
                        :loaded="true"
                      >
                        <template #default="{ item }">
                          <workout-modal
                            :workout="item"
                            :exercises="exercises"
                            event
                            @workout-add="addWorkout"
                          />
                        </template>
                      </card-table>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
          @click="resetForm"
        >
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-show="isEdit"
          text
          color="red"
          @click="handleRemove"
        >
          Delete
        </v-btn>
        <v-btn
          text
          :color="isEdit ? 'blue' : 'green'"
          @click="handleSave"
        >
          {{ isEdit ? 'Edit' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>
        {{ eventInfo.name }}
        <v-spacer></v-spacer>
        <v-btn
          text
          color="blue"
          @click="openEdit"
        >
          Edit
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle
        style="margin-top: 12px;"
      >
        Description
      </v-card-subtitle>
      <v-card-text style="color: black;">
        {{ eventInfo.description || 'No description' }}
      </v-card-text>
      <v-card-subtitle>Type</v-card-subtitle>
      <v-card-text style="color: black;">{{ eventInfo.category }}</v-card-text>
      <v-card-subtitle >Activity start</v-card-subtitle>
      <v-card-text style="color: black;">{{ eventInfo.start }}</v-card-text>
      <v-card-subtitle>Activity end</v-card-subtitle>
      <v-card-text style="color: black;">{{ eventInfo.end }}</v-card-text>
      <v-card-subtitle>
        Activity pulse info
      </v-card-subtitle>
      <v-card-text>
        <line-chart
          v-if="loadedRates"
          :chart-data="heartRates"
        />
        <v-btn
          v-else
          @click="getHeartRates"
        >
          Get heart data
        </v-btn>
      </v-card-text>
      <v-card-subtitle v-show="eventInfo.category === 'workout'">Workout</v-card-subtitle>
      <v-card-text v-if="eventInfo.category === 'workout'">
        <workout-modal
          v-if="eventInfo.workoutId"
          :workout="getWorkout(eventInfo.workoutId)"
          :exercises="exercises"
        />
        <template v-else>
          No workouts selected
        </template>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
        >
          Back
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import WorkoutModal from '../WorkoutModal.vue';
import CardTable from '../CardTable.vue';
import LineChart from '../LineChart.vue';

import user from '../../services/user';

export default {
  components: {
    WorkoutModal,
    CardTable,
    LineChart,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    workouts: {
      type: Object,
      required: true,
    },
    exercises: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    showModal: false,
    editable: false,
    form: {
      name: '',
      type: '',
      description: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
    },
    startDateMenu: false,
    startTimeMenu: false,
    endDateMenu: false,
    endTimeMenu: false,
    defaultEventTypes: [
      { text: 'Activity', value: 'activity' },
      { text: 'Workout', value: 'workout' },
      { text: 'Meal', value: 'meal' },
      { text: 'Job', value: 'job' },
    ],
    eventInfo: {},
    workoutDialog: false,
    loadedRates: false,
    heartRates: {},
  }),
  computed: {
    showForm() {
      return (this.isEdit && this.editable) || this.isAdd;
    },
  },
  methods: {
    openModal(event) {
      this.showModal = true;
      this.eventInfo = event;
    },
    openEdit() {
      this.editable = true;
      const [startDate, startTime] = this.eventInfo.start.split(' ');
      const [endDate, endTime] = this.eventInfo.end.split(' ');
      this.form = {
        id: this.eventInfo.index,
        name: this.eventInfo.name,
        type: this.eventInfo.category,
        description: this.eventInfo.description,
        startDate,
        startTime,
        endDate,
        endTime,
        workoutId: this.eventInfo.workoutId,
      };
    },
    resetForm() {
      this.showModal = false;
      this.editable = false;
      this.loadedRates = true;
      this.heartRates = null;
      this.form = {
        name: '',
        type: '',
        description: '',
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
        workoutId: '',
      };
    },
    removeWorkout() {
      this.form.workoutId = null;
    },
    handleSave() {
      this.$emit(`event-${this.isEdit ? 'editted' : 'created'}`, this.form);
      this.resetForm();
    },
    handleRemove() {
      this.$emit('event-remove', this.form.id);
    },
    getWorkout(id) {
      return this.workouts.myWorkouts.find((w) => w.id === id);
    },
    addWorkout(workout) {
      this.workoutDialog = false;
      this.form.workoutId = workout.id;
    },
    getHeartRates() {
      const [startDate, startTime] = this.eventInfo.start.split(' ');
      const [, endTime] = this.eventInfo.end.split(' ');
      return user.getHeartRates(startDate, startTime, endTime).then(({ data }) => {
        this.heartRates = this.getDataSet(data.heartRates, 'green', 'heartRate');
        this.loadedRates = true;
      });
    },
    getDataSet(arr, backgroundColor, label) {
      return {
        labels: arr.map((e) => e.time),
        datasets: [
          {
            label,
            backgroundColor,
            data: arr.map((e) => e.value),
          },
        ],
      };
    },
  },
};
</script>
