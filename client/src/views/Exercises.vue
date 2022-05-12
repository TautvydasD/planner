<template>
  <v-container class="justify-center">
    <!--
      /**
      * Author: Tautvydas Dikšas
      * Date: 2022-05-10
      * Path: src/views/Exercises
      *
      */
     -->
    <slide-table
      :instances="myExercises"
      title="My exercises"
      :loaded="exercisesLoaded"
      has-add
    >
      <template #header>
        <exercises-modal
          v-show="exercisesLoaded && myExercises.length > 5"
          title="My exercises"
        >
          <template #content="{ on, attrs }">
            <div class="d-flex align-center">
              <v-btn
                v-bind="attrs"
                v-on="on"
                text
              >
                Show all
              </v-btn>
            </div>
          </template>
          <card-table
            :instances="myExercises"
            :loaded="exercisesLoaded"
          >
            <template #default="{ item }">
              <exercise-modal
                :exercise="item"
                is-edit
                @saved-exercise="editExercise"
                @removed-exercise="removeExercise"
              />
            </template>
          </card-table>
        </exercises-modal>
      </template>
      <template #create>
        <exercise-modal
          is-add
          @saved-exercise="addExercise"
        />
      </template>
      <template #default="{ item }">
        <exercise-modal
          :exercise="item"
          is-edit
          @saved-exercise="editExercise"
          @removed-exercise="removeExercise"
        />
      </template>
    </slide-table>
    <card-table
      :instances="exercises"
      :loaded="exercisesLoaded"
      title="Exercises"
    >
      <template #default="{ item }">
        <exercise-modal :exercise="item" />
      </template>
    </card-table>
    <card-table
      :instances="wGerexercises"
      :loaded="exercisesLoaded"
      title="Wger exercises"
    >
      <template #default="{ item }">
        <wger-exercise :exercise="item" />
      </template>
    </card-table>
  </v-container>
</template>
<script>
import WgerExercise from '../components/WgerExercise.vue';
import ExerciseModal from '../components/ExerciseModal.vue';
import ExercisesModal from '../components/CardModal.vue';
import CardTable from '../components/CardTable.vue';
import SlideTable from '../components/SlideTable.vue';

import user from '../services/user';

export default {
  components: {
    WgerExercise,
    ExerciseModal,
    ExercisesModal,
    CardTable,
    SlideTable,
  },
  data: () => ({
    wGerexercises: [],
    exercises: [],
    exercisesLoaded: false,
    myExercises: [],
  }),
  created() {
    this.loadExercises();
  },
  methods: {
    async loadExercises() {
      const wGerResponse = await user.getWgerExercises();
      this.wGerexercises = wGerResponse.data.wGerExercises;
      const exerciseResponse = await user.getExercises();
      this.exercises = exerciseResponse.data.exercises;
      if (exerciseResponse.data.myExercises) {
        this.myExercises = exerciseResponse.data.myExercises;
      }
      this.exercisesLoaded = true;
    },
    addExercise(exercise) {
      return user.createExercise(exercise).then(({ data }) => {
        this.myExercises.push(data.data);
        if (exercise.access_public) {
          this.exercises.push(data.data);
        }
      });
    },
    editExercise(ex) {
      return user.editExercise(ex.id, ex).then(({ data }) => {
        const exercise = data.data;
        const idx = this.myExercises.findIndex((o) => o.id === exercise.id);
        const widx = this.exercises.findIndex((o) => o.id === exercise.id);
        this.$set(this.myExercises, idx, exercise);

        if (!exercise.access_public && widx !== -1) {
          this.exercises = this.exercises.filter((e) => e.id !== exercise.id);
        }
        if (exercise.access_public && widx !== -1) {
          this.$set(this.exercises, widx, exercise);
        }
        if (exercise.access_public && widx === -1) {
          this.exercises.push(exercise);
        }
      });
    },
    removeExercise(id) {
      const exercise = this.myExercises.find((w) => w.id === id);
      this.myExercises = this.myExercises.filter((e) => e.id !== id);
      if (exercise.access_public) {
        this.exercises = this.exercises.filter((e) => e.id !== id);
      }
      return user.removeExercise(id);
    },
  },
};
</script>
