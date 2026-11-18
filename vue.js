const { createApp } = Vue;

createApp({
  data() {
    return { isAuthenticated: false, authToken: "", showLogin: false };
  },
  methods: {
    openLogin() { this.showLogin = true; },
    closeLogin() { this.showLogin = false; },
    handleLogin(token) {
      this.authToken = token;
      this.isAuthenticated = true;
      this.showLogin = false;
    },
    logout() {
      this.authToken = "";
      this.isAuthenticated = false;
      this.showLogin = false;
    },
  },
}).component("login-component", LoginComponent)
  .component("music-record-component", MusicRecordComponent)
  .mount("#app");
