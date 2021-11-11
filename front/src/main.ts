import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  watch:{
    '$route' (to, from){
      console.log(`From: ${from.name} vers: ${to.name}`);
      console.log(store.state.username)
       if (to.name == "Connexion" && from.name == "Creation Partie" && store.state.username) {
         console.log("QUITTER");
         
         store.state.socket.emit('LEAVE')
         store.state.username = null
       }
    }
},
  render: h => h(App)
}).$mount('#app')
