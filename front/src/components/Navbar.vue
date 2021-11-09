<template>
<div class="relative w-screen group">
  <div class="bg-gradient-to-r from-purple-600 to-yellow-500 absolute w-full h-full rounded-b-3xl filter blur opacity-25 transition duration-1000 group-hover:opacity-50"></div>
  <div class="relative bg-black-700 py-4 px-10 text-white rounded-b-3xl flex items-center space-x-5">
    <router-link v-for="route in navs" :key="route.name" :to="route.path">
    <a class="btn-nav" :class="'border-' + route.color">{{route.name}}</a>
    </router-link>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      navs: [
        {
          path: "/",
          name: "Connexion",
          color: "purple-500"
        },
        {
          path: "/publics",
          name: "Parties Publiques",
          color: "yellow-500"
        }
      ]
    }
  }
}
</script>

<style>

</style>