<template>
  <v-app>
    <navigation />
    <v-main>
      <v-container fluid>
        <router-view
          v-if="isAllowedToNavigate"
        />
        <not-found
          v-else
        />
      </v-container>
    </v-main>
    <v-footer
      dark
      padless
    >
      <v-card
        class="flex"
        flat
        tile
      >
        <v-card-title
          class="primary d-flex"
        >
          <v-flex
            :class="{
              'text-center': $vuetify.breakpoint.xs
            }"
            xs12
            sm4
          >
            <strong
              class="subheading"
            >
              Planner
            </strong>
          </v-flex>
          <v-flex
            class="d-flex justify-end"
            :class="{
              'justify-center': $vuetify.breakpoint.xs
            }"
            xs12
            sm8
          >
            <v-btn
              v-for="link in links"
              :key="link.icon"
              class="mx-4"
              dark
              icon
              :to="link.linkName"
            >
              <v-icon size="24px">
                {{ link.icon }}
              </v-icon>
            </v-btn>
          </v-flex>
        </v-card-title>

        <v-card-text class="py-2 white--text text-center">
          {{ new Date().getFullYear() }} — <strong>Tautvydas Dikšas</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation.vue';
import NotFound from './views/404.vue';

export default {
  name: 'App',
  components: {
    Navigation,
    NotFound,
  },
  data: () => ({
    links: [
      {
        icon: 'mdi-view-dashboard',
        linkName: 'Statistics',
      },
      {
        icon: 'mdi-calendar-month',
        linkName: 'Calendar',
      },
      {
        icon: 'mdi-food-apple',
        linkName: 'Logger',
      },
      {
        icon: 'mdi-basketball',
        linkName: 'Exercises',
      },
      {
        icon: 'mdi-dumbbell',
        linkName: 'Workouts',
      },
      {
        icon: 'mdi-account-supervisor-outline',
        linkName: 'Supervisors',
      },
    ],
  }),
  created() {
    if (window.location.search.includes('code=')) {
      this.loginFitbit();
    }
  },
  computed: {
    isAllowedToNavigate() {
      return this.$store.state.auth.isLoggedIn || this.$route.path === '/';
    },
  },
  // mounted() {
  //   this.notifications();
  // },
  methods: {
    loginFitbit() {
      const { code } = this.$route.query;
      console.log(code);
      this.$router.push('/');
      console.log(code);
      return this.$store.dispatch('auth/loginToFitbit', {
        code,
      });
    },
    notifications() {
      Notification.requestPermission();
    },
  },
};
</script>
