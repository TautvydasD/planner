<template>
  <v-dialog
    v-model="workoutModal"
    width="600"
    key="workout"
    :retain-focus="false"
    @click:outside="resetForm"
  >
    <template #activator="{ on, attrs }">
      <slot
        v-if="custom"
        name="custom"
        :attrs="attrs"
        :on="on"
      />
      <v-card
        v-else-if="event"
        class="ma-2"
      >
        <v-img
          :src="workout.image_url && workout.image_url.length > 0
            ? workout.image_url
            : require('../assets/dumbbell.svg')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
        >
          <v-card-title v-text="workout.name" />
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
            @click="addWorkoutToEvent(workout)"
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
          width="300"
          height="250"
          class="d-flex justify-center"
        >
          <v-card-title class="justify-center text-xs-center">
            <v-icon color="primary">
              mdi-plus
            </v-icon>
          </v-card-title>
          <v-card-text class="text-xs-center">
            Create new workout
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
          :src="workout.image_url || require('../assets/dumbbell.svg')"
          class="white--text align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          height="250px"
        >
          <v-card-title v-text="workout.name" />
        </v-img>
      </v-card>
    </template>
    <v-card v-if="showForm">
      <v-card-title>
        {{ `${titleText} workout` }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-text-field
            label="Name"
            v-model="workoutForm.name"
            required
          />
          <v-text-field
            label="Description"
            v-model="workoutForm.description"
            required
          />
          <v-text-field
            label="Sets"
            v-model="workoutForm.sets"
            required
          />
          <v-text-field
            label="Image URL"
            v-model="workoutForm.image_url"
          />
          <v-checkbox
            label="Show publicly"
            v-model="workoutForm.access_public"
          />
          <span class="subtitle-1">Exercises</span>
          <v-dialog
            v-model="exerciseDialog"
            width="800"
          >
            <template #activator="{ on }">
              <v-row>
                <v-col>
                  <v-btn
                    v-on="on"
                    height="50"
                    width="100%"
                    outlined
                    color="primary"
                    cols="12"
                    @click="exerciseDialog = true"
                  >
                    <div class="button-content-wrapper">
                      <v-icon color="primary">
                        mdi-plus
                      </v-icon>
                      Add exercise
                    </div>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <v-card>
              <v-card-title>
                Exercises
              </v-card-title>
              <v-card-text>
                <span class="subtitle-1">My Exercises</span>
                <v-layout wrap>
                  <card-table
                    :instances="exercises.myExercises"
                    :loaded="true"
                  >
                    <template #default="{ item }">
                      <exercise-modal
                        :exercise="item"
                        workout
                        @exercise-add="exercise => addExerciseToWorkout(exercise, 'mine')"
                      />
                    </template>
                  </card-table>
                </v-layout>
                <v-divider class="my-4"></v-divider>
                <span class="subtitle-1">Public exercises</span>
                <v-layout wrap>
                  <card-table
                    :instances="exercises.exercises"
                    :loaded="true"
                  >
                    <template #default="{ item }">
                      <exercise-modal
                        :exercise="item"
                        workout
                        @exercise-add="exercise => addExerciseToWorkout(exercise, 'all')"
                      />
                    </template>
                  </card-table>
                </v-layout>
                <v-divider class="my-4"></v-divider>
                <span class="subtitle-1">wGer exercises</span>
                <v-layout wrap>
                  <card-table
                    :instances="exercises.wGerExercises"
                    :loaded="true"
                  >
                    <template #default="{ item }">
                      <exercise-modal
                        :exercise="item"
                        workout
                        @exercise-add="exercise => addExerciseToWorkout(exercise, 'wger')"
                      />
                    </template>
                  </card-table>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-dialog>
          <div style="position: relative">
            <v-row
              v-for="(ex, index) in workoutExercises"
              :ref="`row-${index}`"
              :key="`ex-${ex.type}-${ex.unique}`"
            >
              <v-col cols="8">
                <component
                  :is="getComponent(ex.type)"
                  :exercise="getExercise(ex.exerciseId, ex.type)"
                  custom
                >
                  <template #custom="{ on, attrs }">
                    <v-card xs8>
                      <v-card-title>
                        <v-icon
                          @mousedown="dnd.handleStart($event, {
                            targetData: $refs[`row-${index}`][0],
                            handleData: handleDataChange
                          })"
                          @touchstart="dnd.handleStart($event, {
                            targetData: $refs[`row-${index}`][0],
                            handleData: handleDataChange
                          })"
                        >
                          mdi-dumbbell
                        </v-icon>
                        <div class="grey--text card-title-name-spacing">
                          {{ ex.name }}
                        </div>
                        <v-spacer />
                        <v-btn
                          icon
                          text
                          color="green"
                          @click="enableExerciseSwap"
                        >
                          <v-icon>mdi-swap-horizontal</v-icon>
                        </v-btn>
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
                          color="error"
                          @click="removeExercise(index)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-card-title>
                    </v-card>
                  </template>
                </component>
              </v-col>
              <v-col
                cols="4"
              >
                <v-text-field
                  label="Reps"
                  v-model="ex.reps"
                  required
                />
              </v-col>
            </v-row>
          </div>
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
          v-show="isEdit"
          text
          color="red"
          @click="removeWorkout"
        >
          Remove
        </v-btn>
        <v-btn
          text
          color="green"
          @click="saveWorkout"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>
        <div>
          {{ workout.name }}
        </div>
        <v-spacer></v-spacer>
        <v-btn
          v-show="isEdit"
          color="blue"
          text
          @click="openEdit"
        >
          Edit
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-subtitle style="padding-top: 20px;">
        Description
      </v-card-subtitle>
      <v-card-text style="color: black;">{{ workout.description || 'None' }}</v-card-text>
      <v-card-subtitle>Sets</v-card-subtitle>
      <v-card-text style="color: black;">{{ workout.sets || 'None' }}</v-card-text>
      <v-card-subtitle>Exercises</v-card-subtitle>
      <v-card-text>
        <v-row
          v-for="(ex, index) in shownExercises"
          :key="`ex.name-${index}`"
        >
          <v-col cols="8">
            <component
              :is="getComponent(ex.type)"
              :exercise="getExercise(ex.exerciseId, ex.type)"
              custom
            >
              <template #custom="{ on, attrs }">
                <v-card xs8>
                  <v-card-title>
                    <v-icon>mdi-dumbbell</v-icon>
                    <div class="grey--text card-title-name-spacing">
                      {{ ex.name }}
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
                  </v-card-title>
                </v-card>
              </template>
            </component>
          </v-col>
          <v-col cols="4">
            <v-card-subtitle style="padding-top: 0;">
              Reps
            </v-card-subtitle>
            <v-card-text>
              {{ ex.reps }}
            </v-card-text>
          </v-col>
        </v-row>
        <div v-show="shownExercises.length === 0">No exercises used</div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          text
          @click="resetForm"
        >
          Back
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import WgerExercise from './WgerExercise.vue';
import ExerciseModal from './ExerciseModal.vue';
import CardTable from './CardTable.vue';

import dnd from '../services/dnd';

export default {
  name: 'WorkoutModal',
  components: {
    ExerciseModal,
    WgerExercise,
    CardTable,
  },
  props: {
    custom: {
      type: Boolean,
      default: false,
    },
    event: {
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
    workout: {
      type: Object,
      default: () => {},
    },
    exercises: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    workoutForm: {
      name: '',
      sets: '',
      image_url: '',
      access_public: false,
      description: '',
    },
    workoutModal: false,
    exerciseDialog: false,
    editable: false,
    workoutExercises: [],
    swapExercise: false,
    swappableExercise: {},
    dnd: dnd(),
  }),
  computed: {
    showForm() {
      return (this.isEdit && this.editable) || this.isAdd;
    },
    titleText() {
      return this.isEdit ? 'Update' : 'Create new';
    },
    shownExercises() {
      const allExercises = [];
      this.workout.exercises.forEach((o) => {
        const exercises = {
          mine: this.exercises.myExercises,
          all: this.exercises.exercises,
          wger: this.exercises.wGerExercises,
        };
        allExercises.push({
          type: o.type,
          reps: o.reps,
          position: o.position,
          name: exercises[o.type][o.exerciseId].name,
          exerciseId: o.exerciseId,
        });
      });
      return allExercises;
    },
  },
  methods: {
    openEdit() {
      this.editable = true;
      this.workoutForm = { ...this.workout };
      const allExercises = [];
      this.workout.exercises.forEach((o, index) => {
        const exercises = {
          mine: this.exercises.myExercises,
          all: this.exercises.exercises,
          wger: this.exercises.wGerExercises,
        };
        allExercises.push({
          type: o.type,
          reps: o.reps,
          position: o.position,
          exerciseId: o.exerciseId,
          name: exercises[o.type][o.exerciseId].name,
          unique: index,
        });
      });
      console.log(allExercises);
      this.workoutExercises = allExercises;
    },
    resetForm() {
      this.workoutModal = false;
      this.workoutExercises = [];
      this.editable = false;
      this.swapExercise = false;
      this.workoutForm = {
        name: '',
        sets: '',
        image_url: '',
        access_public: false,
        description: '',
      };
    },
    removeWorkout() {
      this.resetForm();
      this.$emit('remove-workout', this.workoutForm.id);
    },
    saveWorkout() {
      this.workoutModal = false;
      const form = this.workoutForm;
      form.exercises = this.workoutExercises.map((w, index) => ({
        position: index,
        reps: w.reps,
        type: w.type,
        id: w.exerciseId,
        exerciseId: w.exerciseId,
      }));
      this.resetForm();
      this.$emit('save-workout', form);
    },
    addExerciseToWorkout(exercise, type) {
      this.exerciseDialog = false;
      const newExercise = {
        name: exercise.name,
        exerciseId: exercise.id,
        thirdParty: exercise.thirdParty,
        type,
      };
      if (this.swapExercise) {
        const oldExerciseIdx = this.workoutExercises
          .findIndex((e) => e.id === this.swappableExercise.id);
        this.$set(this.workoutExercises, oldExerciseIdx, newExercise);
        this.swapExercise = false;
        this.swappableExercise = {};
        return;
      }
      this.workoutExercises.push(newExercise);
    },
    enableExerciseSwap(exercise) {
      this.swappableExercise = exercise;
      this.swapExercise = true;
      this.exerciseDialog = true;
    },
    removeExercise(index) {
      this.workoutExercises.splice(index, 1);
    },
    handleDataChange(data, oldIndex) {
      const nodes = Array.prototype.slice.call(data.parentNode.children);
      const targetNewIndex = nodes.indexOf(data);
      this.workoutExercises = this.dnd.getReorderedList(this.workoutExercises,
        oldIndex,
        targetNewIndex);
    },
    getExercise(id, type) {
      const exercises = {
        mine: this.exercises.myExercises,
        all: this.exercises.exercises,
        wger: this.exercises.wGerExercises,
      };
      const targetExercises = exercises[type];
      return targetExercises[id];
    },
    getComponent(type) {
      if (type === 'wger') return 'wger-exercise';
      return 'exercise-modal';
    },
    addWorkoutToEvent(workout) {
      this.$emit('workout-add', {
        id: workout.id,
        name: workout.name,
      });
    },
  },
};
</script>

<style scoped>
.data-row-item-placeholder {
  opacity: 0.5;
}
.data-row-item-draggable {
  border-top: unset;
  position: absolute;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, .2);
  z-index: 10;
  background-color: #fff;
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
}
</style>
