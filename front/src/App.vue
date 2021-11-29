<template>
  <div id="app" class="flex flex-col h-screen bg-black-800">
    <Navbar />
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
