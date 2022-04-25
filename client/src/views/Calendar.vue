<template>
  <v-container>
    <v-sheet
      tile
      class="d-flex"
    >
      <v-btn
        icon
        class="ma-2"
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
        icon
        class="ma-2"
        @click="$refs.calendar.next()"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>

      <v-spacer />

      <settings
        ref="settings"
        @settings-change="getCategories"
      />
      <v-btn
        class="ma-2"
        text
        @click="$refs.settings.enableModal()"
      >
        Calendar settings
      </v-btn>
      <event-form
        @event-created="eventSave"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            class="ma-2"
          >
            Add Event
          </v-btn>
        </template>
      </event-form>
    </v-sheet>
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
        <template v-slot:day-body="{ date, week }">
          <div
            class="v-current-time"
            :class="{ first: date === week[0].date }"
            :style="{ top: nowY }"
          ></div>
        </template>
      </v-calendar>
    </v-sheet>
    <v-menu
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
    >
      <v-card>
        <v-toolbar
          :color="selectedEvent.color"
        >
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <event-form
            ref="event-form"
            isEdit
            @event-editted="eventEdit"
          >
            <template #activator>
              <v-btn
                icon
                @click="openEdit(selectedEvent)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
          </event-form>
        </v-toolbar>
        <v-card-text>
          <span v-html="selectedEvent.description"></span>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="secondary"
            @click="selectedOpen = false"
          >
            Cancel
          </v-btn>
          <v-btn
            text
            color="red"
            @click="() => removeEvent(selectedEvent)"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-container>
</template>

<script>
import settings from '../components/Calendar/Settings.vue';
import eventForm from '../components/Calendar/EventForm.vue';
import user from '../services/user';

export default {
  components: {
    settings,
    eventForm,
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
  }),
  created() {
    this.getEvents();
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
  mounted() {
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
  },
  methods: {
    getCategories(categories) {
      this.settings = categories;
    },
    intervalFormatter(locale, opts) {
      console.log(locale);
      console.log(opts);
      return locale.time;
      // return null;
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
    async getEvents() {
      const { data } = await user.getEvents();
      if (data.sleep) {
        const sleepingData = data.sleep;
        console.log(sleepingData);
        sleepingData.forEach((o) => {
          this.events.push({
            index: o.logId,
            category: 'sleep',
            name: 'Sleeping',
            start: o.startTime.split('.')[0],
            end: o.endTime.split('.')[0],
            color: this.eventColors.sleep,
            timed: false,
            editable: false,
          });
        });
      }
      console.log(data.activities);
      data.activities.forEach((o) => {
        this.events.push({
          index: o.id,
          category: o.type,
          name: o.name,
          description: o.description || 'None yet',
          start: o.startTime,
          end: o.endTime,
          color: this.eventColors[o.type],
          timed: false,
          editable: true,
        });
      });
      // console.log(data);
    },
    getEventColor(event) {
      return event.color;
    },
    showEvent({ nativeEvent, event }) {
      if (event.category === 'sleep') return;
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() => requestAnimationFrame(() => { this.selectedOpen = true; }));
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },
    removeEvent(event) {
      return user.removeEvent(event.index).then(() => {
        const idx = this.events.findIndex((e) => event.index === e.index);
        this.events.splice(idx, 1);
        this.selectedOpen = false;
      });
    },
    openEdit(item) {
      const startVal = item.start.split(' ');
      const endVal = item.end.split(' ');
      this.$refs['event-form'].openEdit({
        id: item.index,
        name: item.name,
        description: item.description,
        type: item.category,
        startDate: startVal[0],
        startTime: startVal[1],
        endDate: endVal[0],
        endTime: endVal[1],
      });
    },
    eventEdit(form) {
      console.log(form);
      const body = {
        name: form.name,
        description: form.description,
        type: form.type,
        startTime: `${form.startDate}T${form.startTime}`,
        endTime: `${form.endDate}T${form.endTime}`,
      };
      return user.editEvent(body, form.id).then(({ data }) => {
        console.log(data);
        const idx = this.events.findIndex((e) => e.index === data.event.id);
        this.$set(this.events, idx, {
          index: data.event.id,
          category: data.event.type,
          name: data.event.name,
          description: data.event.description || 'None yet',
          start: data.event.startTime,
          end: data.event.endTime,
          color: this.eventColors[data.event.type],
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
