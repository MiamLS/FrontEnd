const LoginComponent = {
  template: `
    <section class="login-card" aria-labelledby="login-title">
      <p class="eyebrow">DR MUSIKARKIV</p>
      <h1 id="login-title">Velkommen tilbage</h1>
      <p class="page-description">Log ind for at administrere DR's musiklager.</p>
      <form class="login-form" @submit.prevent="login">
        <label>Brugernavn <input v-model.trim="credentials.username" type="text" autocomplete="username" required></label>
        <label>Adgangskode <input v-model="credentials.password" type="password" autocomplete="current-password" required></label>
        <p v-if="error" class="form-message form-error" role="alert">{{ error }}</p>
        <button class="primary-button" type="submit" :disabled="loading">{{ loading ? 'Logger ind...' : 'Log ind' }}</button>
        <button class="secondary-button" type="button" :disabled="loading" @click="$emit('cancel')">Tilbage til records</button>
      </form>
    </section>
  `,
  data() {
    return {
      credentials: { username: "", password: "" },
      loading: false,
      error: "",
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = "";
      try {
        const response = await axios.post(window.AppConfig.loginUrl, this.credentials);
        const token = response.data.token || response.data.accessToken;
        if (!token) throw new Error("Login-svaret indeholder ikke en token.");
        this.$emit("logged-in", token);
      } catch (error) {
        this.error = `Login mislykkedes: ${error.response?.data?.message || error.message}`;
      } finally {
        this.loading = false;
      }
    },
  },
};
