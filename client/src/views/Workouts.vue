<template>
  <v-container class="justify-center">
    <!--
      /**
      * Author: Tautvydas Dikšas
      * Date: 2022-05-10
      * Path: src/views/Workouts
      *
      */
     -->
    <slide-table
      :instances="myWorkouts"
      title="My workouts"
      :loaded="loaded"
      has-add
    >
      <template #header>
        <card-modal
          v-if="loaded && myWorkouts.length > 5"
          title=" "
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
            :instances="myWorkouts"
            :loaded="loaded"
            title="My workouts"
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
        </card-modal>
      </template>
      <template #create>
        <workout-modal
          :exercises="exercises"
          is-add
          @save-workout="saveWorkout"
        />
      </template>
      <template #default="{ item }">
        <workout-modal
          :exercises="exercises"
          :workout="item"
          is-edit
          @save-workout="editWorkout"
          @remove-workout="removeWorkout"
        />
      </template>
    </slide-table>
    <card-table
      :instances="workouts"
      :loaded="loaded"
      title="Workouts"
    >
      <template #default="{ item }">
        <workout-modal
          :exercises="exercises"
          :workout="item"
        />
      </template>
    </card-table>
  </v-container>
</template>
<script>
import user from '../services/user';
import CardTable from '../components/CardTable.vue';
import WorkoutModal from '../components/WorkoutModal.vue';
import SlideTable from '../components/SlideTable.vue';
import CardModal from '../components/CardModal.vue';

export default {
  components: {
    WorkoutModal,
    CardTable,
    SlideTable,
    CardModal,
  },
  data() {
    return {
      user,
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
        const { data: wGerData } = await this.user.getWgerExercises();
        const { data: exerciseData } = await this.user.getExercises();
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
        const { data } = await this.user.getWorkouts();
        this.workouts = data.workouts;
        this.myWorkouts = data.myWorkouts;
      } catch (error) {
        console.log(error.message);
      }
    },
    saveWorkout(workout) {
      return this.user.addWorkout(workout).then(({ data }) => {
        this.myWorkouts.push(data.workout);
        if (data.workout.access_public) {
          this.workouts.push(data.workout);
        }
      });
    },
    editWorkout(workout) {
      return this.user.editWorkout(workout, workout.id).then(({ data }) => {
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
      return this.user.removeWorkout(id);
    },
  },
};
</script>
