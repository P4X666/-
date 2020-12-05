import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Loading from "./common/loading/index"



createApp(App)
  .use(router)
  // .use(Loading)
  .mount("#app");
