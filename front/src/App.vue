<template>
  <div id="app" class="bg-grey-700 h-screen flex flex-col">
    <Navbar />
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue"
export default {
  components: {
    Navbar
  }
}
</script>
