<template>
  <v-dialog
    v-model="calendarDialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <v-toolbar
        flat
        dark
        color="primary"
      >
        <v-btn
          icon
          color="white"
          @click="resetForm"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          Calendar Settings
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="saveSettings"
          >
            Save
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-list
          three-line
          subheader
        >
          <v-subheader>Calendar Settings</v-subheader>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="form.activity" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Show generic activities
              </v-list-item-title>
              <v-list-item-subtitle>
                Show activities that do not have specified
                 activity category
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="form.job" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Show jobs
              </v-list-item-title>
              <v-list-item-subtitle>
                Show job activities created by user
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="form.workout" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Show workout activities
              </v-list-item-title>
              <v-list-item-subtitle>
                Show workout activities created by user
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="form.sleep" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                Show fitbit sleep data
              </v-list-item-title>
              <v-list-item-subtitle>
                Show sleeping data from fitbit database
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    calendarDialog: false,
    form: {
      sleep: true,
      job: true,
      meal: true,
      activity: true,
      workout: true,
    },
  }),
  created() {
    const settings = localStorage.getItem('calendarSettings');
    if (settings) {
      this.form = JSON.parse(settings);
    }
    this.$emit('settings-change', this.form);
  },
  methods: {
    enableModal() {
      this.calendarDialog = true;
    },
    saveSettings() {
      this.calendarDialog = false;
      localStorage.setItem('calendarSettings', JSON.stringify(this.form));
      this.$emit('settings-change', this.form);
    },
    resetForm() {
      this.calendarDialog = false;
      this.form = {
        sleep: true,
        job: true,
        meal: true,
        activity: true,
        workout: true,
      };
    },
  },
};
</script>
