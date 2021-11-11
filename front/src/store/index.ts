import Vue from 'vue'
import Vuex from 'vuex'
import io from "socket.io-client";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: null,
    //socket: io("http://localhost:8000"),
    socket: io("http://localhost:8000", {transports: ['websocket'], upgrade: false, closeOnBeforeunload: false}),
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
