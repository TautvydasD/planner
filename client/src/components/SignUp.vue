<template>
  <v-dialog
    v-model="activeModal"
    width="400"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        text
        color="white"
        v-show="!loggedIn"
        v-bind="attrs"
        v-on="on"
      >
        Sign Up
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h1 class="display-1">Sign Up</h1>
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
            v-model="username"
            label="Username"
            :rules="usernameRules"
            required
          />
          <v-text-field
            v-model="password"
            type="password"
            label="Password"
            :rules="passwordRules"
            required
          />
          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            :rules="confirmPasswordRules"
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
          class="mb-2"
          width="100%"
          xs12
          @click="signup"
        >
          Sign Up
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'SignUp',
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
  data() {
    return {

      activeModal: false,
      valid: true,
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      username: '',
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => /[a-zA-Z0-9]+/.test(v) || 'Username should only contain letters and numbers',
      ],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        () => this.password === this.confirmPassword || 'Password and Confirm password must match',
      ],
      confirmPassword: '',
      confirmPasswordRules: [
        (v) => !!v || 'Password is required',
        () => this.password === this.confirmPassword || 'Password and Confirm password must match',
      ],
      error: '',
    };
  },
  methods: {
    async signup() {
      await this.$refs.form.validate();
      if (!this.valid) return;
      if (this.email.length === 0 || this.password.length === 0) return;
      try {
        await this.$store.dispatch('auth/signup', {
          email: this.email,
          username: this.username,
          password: this.password,
        });
        this.error = '';
        this.email = '';
        this.username = '';
        this.password = '';
        this.confirmPassword = '';
        this.activeModal = false;
        this.$emit('sign-up', true);
      } catch (error) {
        this.error = 'Unable to sign up';
      }
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
