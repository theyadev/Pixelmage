<template>
  <div class="flex flex-col flex-grow items-center">
    <h1 class="mt-10 mb-10 text-5xl text-white">Pixelmage</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 px-10 gap-4 md:px-52 lg:px-0">
      <div
        class="col-start-2 rounded-2xl shadow-xl bg-black-700 flex flex-col items-center p-10 space-y-5"
      >
        <div class="text-white text-2xl">Paramètres de la partie</div>
        <div class="flex flex-col items-center space-y-2">
          <div class="text-white">Catégorie</div>
          <select v-model="category" :disabled="!host" class="rounded-full py-0.5 px-5" @change="updateGameCategory($event)">
            <option v-for="categorie in categories" :key="categorie">
              {{ categorie }}
            </option>
          </select>
        </div>
        <div class="flex flex-col items-center space-y-2">
          <div class="text-white">Nombre de rounds</div>
          <select v-model="maxRounds" :disabled="!host" class="rounded-full py-0.5 px-6" @change="updateGameMaxRounds($event)">
            <option v-for="i in 6" :key="i">{{ i + 4 }}</option>
          </select>
        </div>
        <button :disabled="!host" class="ring-purple-700 btn flex justify-center disabled:opacity-30 disabled:cursor-default">
          <span class="font-medium uppercase text-purple-700"
            >Démarrer la partie</span
          >
        </button>
        <input
          type="text"
          :value="'localhost:8080/?id=' + id"
          disabled
          class="
            text-red-600
            ring-red-600 ring-1
            relative
            shadow-md
            px-5
            py-1
            bg-black-800
            rounded-full
            transition
            duration-500
            focus:ring
            focus-within:ring-opacity-50
            focus:shadow-lg
            flex
            justify-center
            cursor-text
          "
        />
        <button class="ring-green-700 btn flex justify-center" @click="copyLink">
          <span class="font-medium uppercase text-green-700"
            >Copier le lien</span
          >
        </button>
        <div class="flex flex-wrap justify-center gap-3">
          <div 
            v-for="i in 20"
            :key="i"
            class="relative flex justify-center"
            :class="[users[i - 1] ? 'group' : '']"
          >
            <div
              v-if="users[i - 1]"
              class="
                absolute
                bottom-7
                bg-white
                px-2
                py-0.5
                rounded-lg
                opacity-0
                pointer-events-none
                transition
                duration-300
                transform
                translate-y-7
                scale-50
                group-hover:opacity-100
                group-hover:-translate-y-0
                group-hover:scale-100
              "
            >
              {{ users[i - 1].username }}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="relative h-5 w-5 text-black-300"
              :class="[users[i - 1] ? 'text-white cursor-pointer' : '']"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
      window.addEventListener("beforeunload", this.handleRefresh)
  },
  mounted() {
    console.log(this.$store.state.username);
    if (this.$store.state.username == null) {
      this.$router.push({path:'/'})
    }

    this.socket.on("UPDATED", (data) => {
      let users = data.users;
      this.category = data.category;
      this.maxRounds = data.maxRounds;
      for (let i = 0; i < users.length; i++) {
        if (users[i].username == this.$store.state.username && users[i].host) {
          this.host = true
        }
        this.$set(this.users, i, users[i])
      }
    })

    this.socket.emit("UPDATE", {
      id: parseInt(this.id)
    });
  },
  beforeRouteLeave(to, from, next) {

      this.quit()

    next()
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.handleRefresh)
  },
  data() {
    return {
      socket: this.$store.state.socket,
      id: parseInt(this.$route.query.id),
      categories: ["Anime", "Disney", "Célébrités"],
      users: [],
      host: false,
      category: "Anime",
      maxRounds: 5,
    };
  },
  methods :{
    handleRefresh(event) {
      this.quit()
      event.stopImmediatePropagation()
      event.preventDefault();
    },
    quit() {
      if (this.$store.state.username) {
        console.log("PAGE REFRESH")
        this.socket.emit("LEAVE", {
          name: this.$store.state.username,
          id: this.id
        });
        this.$store.state.username = null
      }
    },
    updateGameCategory(event){
      this.socket.emit("UPDATECATEGORY", {category : event.target.value, id:this.id});
    },
    updateGameMaxRounds(event){
      this.socket.emit("UPDATEMAXROUNDS", {maxRounds : event.target.value, id:this.id});
    },
    copyLink(){
      let url = 'localhost:8080/?id=' + this.id
      navigator.clipboard.writeText(url)
    }
  }
};
</script>

<style></style>
