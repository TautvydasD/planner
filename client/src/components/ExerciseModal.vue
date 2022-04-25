<template>
  <v-dialog
    v-model="activeModal"
    width="600"
    :retain-focus="false"
    @click:outside="resetForm"
  >
    <template #activator="{ on, attrs }">
      <v-card
        v-if="workout"
        class="ma-2"
      >
        <v-img
          :src="exercise.imageUrl && exercise.imageUrl.length > 0
            ? exercise.imageUrl
            : require('../assets/basketball.svg')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
        >
          <v-card-title v-text="exercise.name" />
        </v-img>
        <v-card-actions>
          <v-btn
            v-bind="attrs"
            v-on="on"
            text
          >
            <v-icon
              color="primary"
            >
              mdi-information-outline
            </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="addExerciseToWorkout"
          >
            <v-icon color="primary">
              mdi-plus
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card
        v-else-if="isAdd"
        v-bind="attrs"
        v-on="on"
        width="300"
        height="250"
        class="ma-2"
      >
        <v-alert
          outlined
          color="primary"
          class="d-flex justify-center"
          width="300"
          height="250"
        >
          <v-card-title
            class="justify-center text-xs-center"
          >
            <v-icon
              color="primary"
            >
              mdi-plus
            </v-icon>
          </v-card-title>
          <v-card-text
            class="text-xs-center"
          >
            Create new exercise
          </v-card-text>
        </v-alert>
      </v-card>
      <v-card
        v-else
        v-bind="attrs"
        v-on="on"
        class="ma-2"
        :width="isEdit ? '300' : ''"
      >
        <v-img
          :src="exercise.imageUrl && exercise.imageUrl.length > 0
            ? exercise.imageUrl
            : require('../assets/basketball.svg')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
        >
          <v-card-title v-text="exercise.name" />
        </v-img>
      </v-card>
    </template>
    <v-card v-if="showForm">
      <v-card-title>{{ titleText }} exercise</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            label="Name"
            v-model="form.name"
            required
          />
          <v-text-field
            label="Category"
            v-model="form.category"
          />
          <v-text-field
            label="Description"
            v-model="form.description"
          />
          <v-text-field
            label="Muscles"
            v-model="form.muscles"
          />
          <v-text-field
            label="Secondary muscles"
            v-model="form.muscles_secondary"
          />
          <v-text-field
            label="Equipment"
            v-model="form.equipment"
          />
          <v-text-field
            label="Secondary equipment"
            v-model="form.equipment_secondary"
          />
          <v-text-field
            label="Image URL"
            v-model="form.imageUrl"
          />
          <v-text-field
            label="Video URL"
            v-model="form.videoUrl"
          />
          <v-checkbox
            label="Show publicly"
            v-model="form.access_public"
          />
        </v-form>
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
          text
          color="red"
          @click="removeExercise"
        >
          Remove
        </v-btn>
        <v-btn
          text
          color="blue"
          @click="saveExercise()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>
        <div>
          {{ exercise.name }}
        </div>
        <v-spacer></v-spacer>
        <v-btn
          v-if="isEdit"
          color="blue"
          text
          @click="openEdit"
        >
          Edit
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <div v-for="(value, key) in exercise" :key="key">
        <div v-if="key === 'createdAt'">
          <v-card-subtitle>
            <h2>Created at</h2>
          </v-card-subtitle>
          <v-card-text>
            {{ parseTime(value) }}
          </v-card-text>
        </div>
        <div v-else-if="key === 'access_public'">
          <v-card-subtitle>
            <h2>Visible to public</h2>
          </v-card-subtitle>
          <v-card-text>
            {{ value === 'true' ? 'Yes' : 'No' }}
          </v-card-text>
        </div>
        <div v-else-if="key === 'client'">
          <v-card-subtitle>
            <h2>License author</h2>
          </v-card-subtitle>
          <v-card-text>
            {{ value.username }}
          </v-card-text>
        </div>
        <div v-else-if="!ignorableFields.includes(key)">
          <v-card-subtitle>
            <h2>{{ parseTitle(key) }}</h2>
          </v-card-subtitle>
          <v-card-text>
            {{ parseSubtitle(value) }}
          </v-card-text>
        </div>
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="resetForm()"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'ExerciseModal',
  props: {
    exercise: {
      type: Object,
      default: () => {},
    },
    workout: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      test: 1,
      valid: true,
      activeModal: false,
      editable: false,
      ignorableFields: ['id', 'clientId', 'imageUrl', 'videoUrl', 'updatedAt', 'client', 'createdAt', 'name'],
      form: {
        name: '',
        category: '',
        description: '',
        muscles: '',
        muscles_secondary: '',
        equipment: '',
        equipment_secondary: '',
        imageUrl: '',
        videoUrl: '',
        access_public: false,
      },
    };
  },
  computed: {
    showForm() {
      return (this.isEdit && this.editable) || this.isAdd;
    },
    titleText() {
      return this.isEdit ? 'Update' : 'Create new';
    },
  },
  methods: {
    parseTitle(val) {
      return val.replace(/_/g, ' ').replace(/^./, val[0].toUpperCase());
    },
    parseSubtitle(val) {
      if (val?.length > 0) return val;
      return '-';
    },
    parseTime(val) {
      return val.split('T')[0] || '-';
    },
    resetForm() {
      this.editable = false;
      this.activeModal = false;
      this.form = {
        name: '',
        category: '',
        description: '',
        muscles: '',
        muscles_secondary: '',
        equipment: '',
        equipment_secondary: '',
        imageUrl: '',
        videoUrl: '',
        access_public: false,
      };
    },
    async saveExercise() {
      await this.$refs.form.validate();
      if (!this.valid) return;
      if (this.form.name.length === 0) return;
      const { form } = this;
      this.resetForm();
      this.$emit('saved-exercise', form);
    },
    removeExercise() {
      this.resetForm();
      this.$emit('removed-exercise', this.exercise.id);
    },
    openEdit() {
      this.editable = true;
      this.form = { ...this.exercise };
    },
    addExerciseToWorkout() {
      this.$emit('exercise-add', {
        id: this.exercise.id,
        name: this.exercise.name,
        thirdParty: false,
      });
    },
  },
};
</script>
