const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

const session = Vue.reactive({
  isAuthenticated: false,
  authToken: "",
});

const MusicArchiveView = {
  components: { MusicRecordComponent },
  template: `
    <music-record-component
      :auth-token="session.authToken"
      :is-authenticated="session.isAuthenticated"
      @login="$router.push('/login')"
      @logout="logout"
    ></music-record-component>
  `,
  setup() {
    const router = VueRouter.useRouter();

    return {
      session,
      logout() {
        session.authToken = "";
        session.isAuthenticated = false;
        router.push("/");
      },
    };
  },
};

const LoginView = {
  components: { LoginComponent },
  template: `
    <login-component
      @logged-in="handleLogin"
      @cancel="$router.push('/')"
    ></login-component>
  `,
  setup() {
    const router = VueRouter.useRouter();

    return {
      handleLogin(token) {
        session.authToken = token;
        session.isAuthenticated = true;
        router.push("/");
      },
    };
  },
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: MusicArchiveView },
    { path: "/login", component: LoginView },
  ],
});

createApp({
  setup() {
    return { session };
  },
})
  .use(router)
  .mount("#app");
