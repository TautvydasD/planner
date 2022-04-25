<template>
  <v-container class="justify-center">
    <v-container class="col-lg-8">
      <v-divider style="margin-bottom: 12px;" />
      <div class="d-flex">
        <h1 class="subheading justify-center grey--text">
          My exercises
        </h1>
        <v-spacer></v-spacer>
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
      </div>
      <v-divider style="margin-top: 12px;" />
      <v-sheet class="mx-auto">
        <v-slide-group
          show-arrows
          class="justify-center"
        >
          <v-slide-item key="create">
            <exercise-modal
              is-add
              @saved-exercise="addExercise"
            />
          </v-slide-item>
          <v-slide-item
            v-for="(exercise, index) in myExercises"
            :key="`${exercise.name}.${index}`"
          >
            <exercise-modal
              :exercise="exercise"
              is-edit
              @saved-exercise="editExercise"
              @removed-exercise="removeExercise"
            />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
      <v-divider style="margin-bottom: 12px;" />
      <h1 class="subheading grey--text my-3">
        Exercises
      </h1>
      <v-divider style="margin-bottom: 12px;" />
      <v-layout wrap>
        <card-table
          :instances="exercises"
          :loaded="exercisesLoaded"
        >
          <template #default="{ item }">
            <exercise-modal :exercise="item" />
          </template>
        </card-table>
      </v-layout>
      <v-divider style="margin-top: 12px;" />
      <h1 class="subheading grey--text my-3">
        Wger exercises
      </h1>
      <v-divider style="margin-bottom: 12px;" />
      <v-layout wrap>
        <card-table
          :instances="wGerexercises"
          :loaded="exercisesLoaded"
        >
          <template #default="{ item }">
            <wger-exercise :exercise="item" />
          </template>
        </card-table>
      </v-layout>
    </v-container>
  </v-container>
</template>

<script>
import WgerExercise from '../components/WgerExercise.vue';
import ExerciseModal from '../components/ExerciseModal.vue';
import user from '../services/user';
import CardTable from '../components/CardTable.vue';
import ExercisesModal from '../components/CardModal.vue';

export default {
  components: {
    WgerExercise,
    ExerciseModal,
    CardTable,
    ExercisesModal,
  },
  data: () => ({
    wGerexercises: [],
    exercises: [],
    exercisesLoaded: false,
    myExercises: [],
  }),
  computed: {
  },
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
