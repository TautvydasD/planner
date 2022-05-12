<template>
  <v-dialog
    v-model="activeModal"
    width="400"
  >
    <!--
      /**
      * Author: Tautvydas Dikšas
      * Date: 2022-05-10
      * Path: src/components/Login
      *
      */
     -->
    <template #activator="{ on, attrs }">
      <v-btn
        v-show="!loggedIn"
        v-bind="attrs"
        v-on="on"
      >
        Login
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h1 class="display-1">Login</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="email"
            label="Email"
            :rules="emailRules"
            required
          />
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            :rules="passwordRules"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions v-if="error.length > 0">
        <v-alert
          width="100%"
          type="error"
        >
          {{ error }}
        </v-alert>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          class="mb-2 mt-2"
          width="100%"
          xs12
          @click="login"
        >
          Login
        </v-btn>
      </v-card-actions>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          class="white--text mb-2 mt-2"
          color="#00B0B9"
          width="100%"
          xs12
          @click="loginToFitbit()"
        >
          Login with Fitbit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Login',
  props: {
    modalActive: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    activeModal: false,
    valid: true,
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      (v) => !!v || 'Password is required',
    ],
    error: '',
  }),
  methods: {
    async login() {
      await this.$refs.form.validate();
      if (!this.valid) return;
      if (this.email.length === 0 || this.password.length === 0) return;
      try {
        await this.$store.dispatch('auth/login', {
          email: this.email,
          password: this.password,
        });
        this.error = '';
        this.email = '';
        this.password = '';
        this.activeModal = false;
        this.$emit('login', true);
      } catch (_) {
        this.error = 'Unable to login';
      }
    },
    loginToFitbit() {
      window.location.href = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=2385GX&redirect_uri=http%3A%2F%2Flocalhost%3A8080&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800';
    },
  },
};
</script>

<style scoped>
.alert-align {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
