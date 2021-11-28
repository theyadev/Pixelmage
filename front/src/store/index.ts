import Vue from 'vue'
import Vuex from 'vuex'
import io from "socket.io-client";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null,
    socket: io("pixelmage-back-f46xp.ondigitalocean.app", {transports: ['websocket'], upgrade: false, closeOnBeforeunload: false}),
    // socket: io("http://localhost:8000", {transports: ['websocket'], upgrade: false, closeOnBeforeunload: false}),
    // socket: io("http://93.6.41.243:8271/", {transports: ['websocket'], upgrade: false, closeOnBeforeunload: false}),
    connected: false,
  },
  mutations: {
    connection(state) {
      state.connected = true;
    },
  },
  actions: {
  },
  modules: {
  }
})
