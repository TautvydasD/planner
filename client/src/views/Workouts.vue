<template>
  <v-container class="justify-center">
    <v-container class="col-lg-8">
      <v-layout>
        <v-flex>
          <workout-modal
            :exercises="exercises"
            is-add
            @save-workout="saveWorkout"
          />
        </v-flex>
      </v-layout>
      <v-divider
        style="margin-top: 12px;"
      />
      <h1 class="subheading grey--text my-3">
        My workouts
      </h1>
      <v-divider
        style="margin-bottom: 12px;"
      />
      <v-layout wrap>
        <card-table
          :instances="myWorkouts"
          :loaded="loaded"
        >
          <template #default="{ item }">
            <workout-modal
              :exercises="exercises"
              :workout="item"
              is-edit
              @save-workout="editWorkout"
              @remove-workout="removeWorkout"
            />
          </template>
        </card-table>
      </v-layout>
      <v-divider
        style="margin-top: 12px;"
      />
      <h1 class="subheading grey--text my-3">
        Workouts
      </h1>
      <v-divider
        style="margin-bottom: 12px;"
      />
      <v-layout wrap>
        <card-table
          :instances="workouts"
          :loaded="loaded"
        >
          <template #default="{ item }">
            <workout-modal
              :exercises="exercises"
              :workout="item"
            />
          </template>
        </card-table>
      </v-layout>
    </v-container>
  </v-container>
</template>
<script>
import user from '../services/user';
import CardTable from '../components/CardTable.vue';
import WorkoutModal from '../components/WorkoutModal.vue';

export default {
  components: {
    WorkoutModal,
    CardTable,
  },
  data() {
    return {
      myWorkouts: [],
      workouts: [],
      exercises: {},
      loaded: false,
    };
  },
  created() {
    this.loadPageData();
  },
  methods: {
    loadPageData() {
      return this.loadWorkouts()
        .then(this.loadExercises);
    },
    async loadExercises() {
      try {
        const { data: wGerData } = await user.getWgerExercises();
        const { data: exerciseData } = await user.getExercises();
        const exercises = {};
        exerciseData.exercises.forEach((o) => {
          exercises[o.id] = o;
        });
        const myExercises = {};
        exerciseData.myExercises.forEach((o) => {
          myExercises[o.id] = o;
        });
        const wGerExercises = {};
        wGerData.wGerExercises.forEach((o) => {
          wGerExercises[o.id] = o;
        });
        this.exercises = {
          exercises,
          myExercises,
          wGerExercises,
        };
        this.loaded = true;
      } catch (error) {
        console.log(error.message);
      }
    },
    async loadWorkouts() {
      try {
        const { data } = await user.getWorkouts();
        this.workouts = data.workouts;
        this.myWorkouts = data.myWorkouts;
      } catch (error) {
        console.log(error.message);
      }
    },
    saveWorkout(workout) {
      return user.addWorkout(workout).then(({ data }) => {
        this.myWorkouts.push(data.workout);
        if (data.workout.access_public) {
          this.workouts.push(data.workout);
        }
      });
    },
    editWorkout(workout) {
      return user.editWorkout(workout, workout.id).then(({ data }) => {
        const idx = this.myWorkouts.findIndex((o) => o.id === data.workout.id);
        const widx = this.workouts.findIndex((o) => o.id === data.workout.id);
        this.$set(this.myWorkouts, idx, data.workout);

        if (!data.workout.access_public && widx !== -1) {
          this.workouts = this.workouts.filter((w) => w.id !== data.workout.id);
        }
        if (data.workout.access_public && widx !== -1) {
          this.$set(this.workouts, widx, data.workout);
        }
        if (data.workout.access_public && widx === -1) {
          this.workouts.push(data.workout);
        }
      });
    },
    removeWorkout(id) {
      const workout = this.myWorkouts.find((w) => w.id === id);
      if (workout.access_public) {
        this.workouts = this.workouts.filter((w) => w.id !== id);
      }
      this.myWorkouts = this.myWorkouts.filter((w) => w.id !== id);
      return user.removeWorkout(id);
    },
  },
};
</script>
