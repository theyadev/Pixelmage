import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";

Vue.use(Vuex);

const PRODUCTION = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 8080

const BASE_URL = PRODUCTION
  ? "https://www.pixelmage.tk"
  : "http://localhost:" + PORT;

const SERVER_URL = PRODUCTION
  ? "https://pixelmage-backend.herokuapp.com"
  : "http://localhost:8000";

export default new Vuex.Store({
  state: {
    BASE_URL,
    username: null,
    socket: io(SERVER_URL, {
      transports: ["websocket"],
      upgrade: false,
      closeOnBeforeunload: false,
    }),
  },
});
