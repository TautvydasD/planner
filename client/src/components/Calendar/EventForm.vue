<template>
  <v-dialog
    v-model="showForm"
    max-width="600px"
  >
    <template #activator="{ on, attrs }">
      <slot
        :on="on"
        :attrs="attrs"
        name="activator"
      />
    </template>
    <v-card>
      <v-card-title>
        <span clas="text-h5">{{ isEdit ? 'Update' : 'Create new' }} event</span>
      </v-card-title>
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
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="resetForm"
        >
          Close
        </v-btn>
        <v-btn
          text
          @click="saveEvent"
        >
          {{ isEdit ? 'Edit' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    showForm: false,
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
  }),
  methods: {
    openEdit(item) {
      this.showForm = true;
      this.form = item;
    },
    saveEvent() {
      this.$emit(`event-${this.isEdit ? 'editted' : 'created'}`, this.form);
      this.resetForm();
    },
    resetForm() {
      this.showForm = false;
      this.form = {
        name: '',
        type: '',
        description: '',
        startDate: null,
        startTime: null,
        endDate: null,
        endTime: null,
      };
    },
  },
};
</script>
