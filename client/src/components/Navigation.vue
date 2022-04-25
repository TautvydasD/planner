<template>
  <nav>
    <v-app-bar
      app
      color="primary"
    >
      <v-app-bar-nav-icon
        v-if="isLoggedIn"
        color="white"
        @click="activeModal = !activeModal"
      />
      <v-app-bar-title>
        <router-link
          class="text-uppercase white--text no-decoration"
          to="/"
        >
          planner
        </router-link>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <sign-up v-if="!isLoggedIn" />
      <login v-if="!isLoggedIn" />
      <v-btn
        v-show="isLoggedIn"
        text
        color="white"
        @click="logout"
      >
        <span>Logout</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="isLoggedIn"
      app
      v-model="activeModal"
    >
      <v-list>
        <v-list-item
          link
          @click="$refs.settings.openSettings(profile)"
        >
          <v-list-item-avatar>
            <v-img :src="`https://avatars.dicebear.com/api/bottts/${profile.email}.svg`" alt="" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ profile.username }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ profile.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav>
        <v-list-item
          v-for="(link, i) in links"
          :key="i"
          link
          router
          :to="link.linkName"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title >{{ link.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <profile-settings
        ref="settings"
      />
      <!-- Expired token
      eyJhbGciOiJIUzI1NiJ9
      .eyJhdWQiOiIyMzg1R1giLCJzdWIiOiI3VDc4N1kiLCJp
      c3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iL
      CJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd3dlaS
      B3c29jIHdhY3Qgd3NldCB3bG9jIiwiZXhwIjoxNjQ4MjczMzc4LCJpYXQiOjE2NDgyNDQ1Nzh9
      .7IOkC2jVX0lRf57xmArIATUbXdoJahXHTjXqkE9gtVQ -->
    </v-navigation-drawer>
  </nav>
</template>

<script>
import Login from './Login.vue';
import SignUp from './SignUp.vue';
import ProfileSettings from './ProfileSettings.vue';

export default {
  name: 'Navigation',
  components: {
    Login,
    SignUp,
    ProfileSettings,
  },
  data: () => ({
    widgets: '',
    sound: false,
    activeModal: false,
    links: [
      {
        icon: 'mdi-view-dashboard',
        linkName: 'Statistics',
        title: 'Statistics',
      },
      {
        icon: 'mdi-calendar-month',
        linkName: 'Calendar',
        title: 'My Calendar',
      },
      {
        icon: 'mdi-food-apple',
        linkName: 'Logger',
        title: 'Logger',
      },
      {
        icon: 'mdi-basketball',
        linkName: 'Exercises',
        title: 'Exercises',
      },
      {
        icon: 'mdi-dumbbell',
        linkName: 'Workouts',
        title: 'Workouts',
      },
      {
        icon: 'mdi-account-supervisor-outline',
        linkName: 'Supervisors',
        title: 'Supervisors',
      },
    ],
  }),
  computed: {
    isLoggedIn() {
      return this.$store.state.auth.isLoggedIn;
    },
    profile() {
      return this.$store.state.profile;
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.loadUserProfile();
    }
  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.loadUserProfile();
      }
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('auth/logout');
      if (this.$route.path === '/') return;
      this.$router.push('/');
    },
    loadUserProfile() {
      return this.$store.dispatch('getProfileData');
    },
  },
};
</script>

<style scoped>
.no-decoration {
  text-decoration: none;
}
</style>
