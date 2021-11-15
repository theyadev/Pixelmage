import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'
import Toasted from 'vue-toasted';

Vue.config.productionTip = false

Vue.use(Toasted)

new Vue({
  router,
  store,
  watch:{
    '$route' (to, from){
       if (to.name == "Connexion" && from.name == "Creation Partie" && store.state.username) {   
         store.state.socket.emit('LEAVE')
         store.state.username = null
       }
    }
},
  render: h => h(App)
}).$mount('#app')
