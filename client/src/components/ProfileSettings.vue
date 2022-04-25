<template>
  <v-dialog
    v-model="showSettings"
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
          @click="exitSettings"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          User Settings
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
          <v-form>
            <v-subheader>User data</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
                <v-list-item-subtitle>
                  <v-text-field
                    label="Users email"
                    v-model="form.email"
                    :disabled="form.verified === 0"
                  />
                  <v-text-field
                    label="Description"
                    v-model="form.description"
                  />
                  <v-text-field
                    label="Height (cm)"
                    v-model="form.height"
                  />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-show="form.hasFitbit">
              <v-list-item-action>
                <v-checkbox v-model="form.useFitbit" />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Save to data Fitbit database</v-list-item-title>
                <v-list-item-subtitle>
                  Allow your data to be stored to fitbit database
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Profile status</v-list-item-title>
                <v-list-item-subtitle :class="`${verificationStatuses[form.verified].color}--text`">
                  {{ verificationStatuses[form.verified].text }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-subheader>Logger data</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Goals</v-list-item-title>
                <v-list-item-subtitle>
                  <v-text-field
                    label="Water to drink daily (ml)"
                    v-model="form.water"
                    hint="Used in statistics page to show daily water intake left"
                  />
                  <v-text-field
                    label="Calorie intake"
                    v-model="form.calories"
                    hint="Used in statistics page to show daily calorie intake left"
                  />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-form>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      showSettings: false,
      form: {
        email: '',
        description: '',
        water: '',
        calories: '',
        height: '',
        verified: 1,
      },
      status: 1,
      verificationStatuses: [
        {
          text: 'Verified',
          color: 'green',
        },
        {
          text: 'Unverified',
          color: 'red',
        },
      ],
    };
  },
  methods: {
    openSettings(userData) {
      this.showSettings = true;
      this.form = userData;
    },
    exitSettings() {
      this.showSettings = false;
      this.form = {
        email: '',
        description: '',
        water: '',
        calories: '',
        height: '',
        verified: 1,
      };
    },
    saveSettings() {
      return this.$store.dispatch('updateProfileData', this.form).then(() => {
        this.showSettings = false;
      });
    },
  },
};
</script>
