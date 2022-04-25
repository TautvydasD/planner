<template>
  <v-dialog
    v-model="weightModal"
    width="600"
    key="create"
    :retain-focus="false"
    @click:outside="resetForm"
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :attrs="attrs"
        :on="on"
      />
    </template>
    <v-card>
      <v-card-title>{{ `${isEdit ? 'Update' : 'Create'} weight log` }}</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="form.weight"
            label="Weight (kg)"
          />
          <v-text-field
            v-model="form.bodyFat"
            label="Body fat (%)"
          />
        </v-form>
        <v-row>
          <v-col cols="6">
            <v-menu
              v-model="loggedAtDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              xs6
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="form.loggedAtDate"
                  label="Logged at date"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="form.loggedAtDate"
                no-title
                first-day-of-week="1"
                @input="loggedAtDateMenu = false"
              />
            </v-menu>
          </v-col>
          <v-col
            cols="6"
          >
            <v-menu
              ref="loggedAtTimeMenu"
              v-model="loggedAtTimeMenu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              xs6
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="form.loggedAtTime"
                  label="Logged at time"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-time-picker
                v-if="loggedAtTimeMenu"
                v-model="form.loggedAtTime"
                no-title
                format="24hr"
                @click:minute="$refs.loggedAtTimeMenu.save(form.loggedAtTime)"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          @click="resetForm"
        >
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="green"
          @click="handleSave"
        >
          {{ isEdit ? 'Edit' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'WeightLogModal',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    form: {
      weight: '',
      bodyFat: '',
      loggedAtTime: '',
      loggedAtDate: '',
    },
    weightModal: false,
    loggedAtDateMenu: false,
    loggedAtTimeMenu: false,
  }),
  methods: {
    handleSave() {
      this.$emit(`weight-log-${this.isEdit ? 'edit' : 'save'}`, this.form);
      this.resetForm();
    },
    resetForm() {
      this.weightModal = false;
      this.form = {
        weight: '',
        bodyFat: '',
        loggedAtTime: '',
        loggedAtDate: '',
      };
    },
    handleEdit(item) {
      this.weightModal = true;
      this.form = item;
    },
  },
};
</script>
