<template>
  <v-container>
    <v-row>
      <v-col
        class="d-flex"
        cols="12"
        xs="12"
        sm="6"
      >
        <v-btn
          class="ma-2"
          icon
          @click="$refs.calendar.prev()"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="type"
          :items="types"
          dense
          outlined
          hide-details
          class="ma-2"
          label="type"
        ></v-select>
        <v-btn
          class="ma-2"
          icon
          @click="$refs.calendar.next()"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
      <v-col
        cols="6"
        xs="6"
        sm="3"
      >
        <settings
          ref="settings"
          @settings-change="getCategories"
        />
        <v-btn
          class="ma-2"
          text
          small
          @click="$refs.settings.enableModal()"
        >
          Calendar settings
        </v-btn>
      </v-col>
      <v-col
        cols="6"
        xs="6"
        sm="3"
        class="d-flex justify-end"
      >
        <event-modal
          :exercises="exercises"
          :workouts="workouts"
          is-add
          @event-created="eventSave"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              small
              class="ma-2"
            >
              Add event
            </v-btn>
          </template>
        </event-modal>
      </v-col>
    </v-row>
    <v-sheet
      xs12
      sm6
      md4
      lg3
    >
      <v-calendar
        ref="calendar"
        v-model="value"
        :type="type"
        :events="filteredEvents"
        :event-overlap-threshold="30"
        :event-color="getEventColor"
        :weekdays="weekDays"
        @click:event="showEvent"
      >
        <template #day-body="{ date, week }">
          <div
            class="v-current-time"
            :class="{ first: date === week[0].date }"
            :style="{ top: nowY }"
          />
        </template>
      </v-calendar>
    </v-sheet>
    <event-modal
      ref="eventModal"
      isEdit
      :exercises="exercises"
      :workouts="workouts"
      @event-editted="editEvent"
      @event-remove="removeEvent"
    />
  </v-container>
</template>

<script>
import Settings from '../components/Calendar/Settings.vue';
import EventModal from '../components/Calendar/EventModal.vue';

import user from '../services/user';

export default {
  components: {
    Settings,
    EventModal,
  },
  data: () => ({
    calendarDialog: false,
    type: 'week',
    types: ['month', 'week', 'day'],
    weekDays: [1, 2, 3, 4, 5, 6, 0],
    events: [],
    value: '',
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    eventColors: {
      meal: 'green',
      workout: 'indigo',
      sleep: 'blue',
      job: 'grey',
      activity: 'orange',
    },
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    ready: false,
    settings: {},
    exercises: {},
    workouts: {},
  }),
  created() {
    this.loadData();
  },
  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
  },
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? `${this.cal.timeToY(this.cal.times.now)}px` : '-10px';
    },
    filteredEvents() {
      return this.events.filter((e) => this.settings[e.category]);
    },
  },
  methods: {
    loadData() {
      return Promise.all([
        user.getEvents(),
        user.getWorkouts(),
        user.getExercises(),
      ]).then(([{ data: events }, { data: workouts }, { data: exercises }]) => {
        this.events = events.activities.map((o) => ({
          index: o.id,
          category: o.type,
          name: o.name,
          description: o.description,
          start: o.startTime,
          end: o.endTime,
          color: this.eventColors[o.type],
          timed: false,
          editable: true,
          workoutId: o.workoutId,
        }));
        if (events.sleep) {
          events.sleep.forEach((o) => {
            const start = o.startTime.replace(/T/g, ' ').slice(0, 16);
            const end = o.endTime.replace(/T/g, ' ').slice(0, 16);
            this.events.push({
              index: o.logId,
              category: 'sleep',
              name: 'Sleeping with watch',
              description: o.description,
              start,
              end,
              color: this.eventColors.sleep,
              timed: false,
              editable: true,
            });
          });
        }
        this.workouts = workouts;
        this.exercises = exercises;
        console.log(events);
        console.log(workouts);
        console.log(exercises);
      });
    },
    getCategories(categories) {
      this.settings = categories;
    },
    getCurrentTime() {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);
      this.cal.scrollToTime(first);
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
    },
    getEventColor(event) {
      return event.color;
    },
    showEvent({ nativeEvent, event }) {
      if (event.category === 'sleep') return;
      const open = () => {
        this.$refs.eventModal.openModal(event);
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => { this.selectedOpen = true; }));
      };

      if (this.selectedOpen) {
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    removeEvent(id) {
      return user.removeEvent(id).then(() => {
        const idx = this.events.findIndex((e) => id === e.index);
        this.events.splice(idx, 1);
      });
    },
    editEvent(form) {
      const body = {
        name: form.name,
        description: form.description,
        type: form.type,
        startTime: `${form.startDate}T${form.startTime}`,
        endTime: `${form.endDate}T${form.endTime}`,
        workoutId: form.workoutId,
      };
      return user.editEvent(body, form.id).then(({ data }) => {
        console.log(data);
        const idx = this.events.findIndex((e) => e.index === data.event.id);
        this.$set(this.events, idx, {
          index: data.event.id,
          category: data.event.type,
          name: data.event.name,
          description: data.event.description,
          start: data.event.startTime,
          end: data.event.endTime,
          color: this.eventColors[data.event.type],
          workoutId: data.event.workoutId,
          timed: false,
          editable: true,
        });
      });
    },
    eventSave(form) {
      const body = {
        name: form.name,
        description: form.description,
        type: form.type,
        startTime: `${form.startDate}T${form.startTime}`,
        endTime: `${form.endDate}T${form.endTime}`,
      };
      return user.addEvent(body).then(({ data }) => {
        this.events.push({
          index: data.event.id,
          name: data.event.name,
          category: data.event.type,
          description: data.event.description,
          start: data.event.startTime,
          end: data.event.endTime,
          color: this.eventColors[data.event.type],
          timed: false,
          editable: true,
        });
        this.selectedOpen = false;
      });
    },
  },
};
</script>

<style lang="scss">
.v-current-time {
  height: 2px;
  background-color: #1976d2;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #1976d2;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
</style>
