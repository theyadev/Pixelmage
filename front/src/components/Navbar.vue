<template>
        <div class="absolute overflow-x-hidden h-32">
            <div class="absolute inset-y-1 h-16 transform rotate-1 w-screen bg-green-500 "></div>
            <div class="absolute inset-y-1 h-16 transform -rotate-1 w-screen bg-red-500"></div>
            <div class="absolute inset-y-0.5 h-16 transform rotate-1 w-screen" style="background-color:rgb(10, 10, 10)"></div>
            <div class="absolute inset-y-0.5 h-16 transform -rotate-1 w-screen bg-opacity-95" style="background-color:rgb(10, 10, 10)"></div>

            <div id="navbar" class="relative h-16 w-screen text-white grid grid-cols-3 gap-4 items-center" style="background-color:rgb(10, 10, 10)">
                <router-link to="/"
                    class="justify-self-center select-none text-xl underline red-underline px-5 py-1 cursor-pointer rounded hover:bg-opacity-20 hover:bg-red-400">
                    Accueil</router-link>
                <router-link to="/"
                    class="justify-self-center select-none text-3xl px-5 py-1 cursor-pointer rounded hover:bg-opacity-20 hover:bg-gray-400">
                    Pixelmage</router-link>
                <router-link to="/publics"
                    class="justify-self-center select-none text-xl underline green-underline px-5 py-1 cursor-pointer rounded hover:bg-opacity-20 hover:bg-green-400">
                    Publiques</router-link>
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
    .red-underline {
        text-decoration-color: #EF4444;
        text-underline-offset: 3px;
    }

    .green-underline {
        text-decoration-color: #10B981;
        text-underline-offset: 3px;
    }
</style>