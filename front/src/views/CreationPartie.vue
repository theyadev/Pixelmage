<template>
  <div class="flex flex-col flex-grow items-center">
    <h1 class="mt-10 mb-10 text-5xl text-white">Pixelmage</h1>
    <div class="grid grid-cols-1 lg:grid-cols-3 px-10 gap-4 md:px-52 lg:px-0">
      <div
        class="
          col-start-2
          rounded-2xl
          shadow-xl
          bg-black-700
          flex flex-col
          items-center
          p-10
          space-y-5
        "
      >
        <div class="text-white text-2xl">Paramètres de la partie</div>
        <div class="flex flex-col items-center space-y-2">
          <div class="text-white">Catégorie</div>
          <select
            v-model="category"
            :disabled="!host"
            class="rounded-full py-1"
            @change="updateGameCategory($event)"
          >
            <option v-for="categorie in categories" :key="categorie">
              {{ categorie }}
            </option>
          </select>
        </div>
        <div class="flex flex-col items-center space-y-2">
          <div class="text-white">Nombre de rounds</div>
          <select
            v-model="maxRounds"
            :disabled="!host"
            class="rounded-full py-1"
            @change="updateGameMaxRounds($event)"
          >
            <option v-for="i in 6" :key="i">{{ i }}</option>
          </select>
        </div>
        
        <div class="flex items-center">
          <button @click="previousColorIndex">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="h-5 w-5 rounded-full" :style="'background-color:#' + colors[colorIndexSelected]"></div>

          <button @click="nextColorIndex">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button
          :disabled="!host"
          class="
            ring-purple-700
            btn
            flex
            justify-center
            disabled:opacity-30 disabled:cursor-default
          "
        >
          <span class="font-medium uppercase text-purple-700" @click="startGame"
            >Démarrer la partie</span
          >
        </button>
        <button
          class="ring-green-700 btn flex justify-center"
          @click="copyLink"
        >
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
            <div v-if="users[i - 1]" class="icon-tooltip">
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
    window.addEventListener("beforeunload", this.handleRefresh);
  },
  mounted() {
    if (this.$store.state.username == null) {
      this.$router.push({ path: "/" });
    }

    this.socket.on("UPDATED", (room) => {
      if (room.started == true) {
        this.socket.off("UPDATED");
        this.$router.push({ path: "/game", query: { id: room.id } });
        return;
      }

      let users = room.users;
      this.category = room.category;
      this.maxRounds = room.maxRounds;
      for (let i = 0; i < 20; i++) {
        if (users[i]) {
          if (
            users[i].username == this.$store.state.username &&
            users[i].host
          ) {
            this.host = true;
          }
          this.$set(this.users, i, users[i]);
        } else {
          this.$set(this.users, i, null);
        }
      }
    });

    this.socket.emit("UPDATE", {
      id: parseInt(this.id),
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != "Jeu") this.quit();

    next();
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.handleRefresh);
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
      colors : ["FF0000", "FF3E00", "FFD800", "1FFF00", "00FFCD", "009BFF", "004DFF", "0008FF", "6400FF", "C500FF", 
          "FB71C3", "D57700", "BEE800", "016A23", "12003D", "3D0038", "4C0000", "F09761", "4F4640", "9AA4CA"],
      colorIndexSelected : 0
    };
  },
  methods: {
    handleRefresh(event) {
      this.quit();
      event.stopImmediatePropagation();
      event.preventDefault();
    },
    quit() {
      if (this.$store.state.username) {
        this.socket.emit("LEAVE", {
          name: this.$store.state.username,
          id: this.id,
        });
        this.$store.state.username = null;
      }
    },
    updateGameCategory(event) {
      this.socket.emit("UPDATE CATEGORY", {
        category: event.target.value,
        id: this.id,
      });
    },
    updateGameMaxRounds(event) {
      this.socket.emit("UPDATE MAX ROUNDS", {
        maxRounds: event.target.value,
        id: this.id,
      });
    },
    copyLink() {
      const url = "https://pixelmage.vercel.app/?id=" + this.id;
      navigator.clipboard.writeText(url);
      this.$toasted.success("Copied !", {
        theme: "toasted-primary",
        position: "top-center",
        duration: 1000,
      });
    },
    startGame() {
      this.socket.emit("START", { id: this.id });
    },
    emitChangeColorInServer(){
      this.socket.emit("CHANGE COLOR", {
          id: this.id,
          name: this.$store.state.username,
          color: this.colors[this.colorIndexSelected]
        })
    },
    nextColorIndex(){
      if (this.colorIndexSelected<this.colors.length){
        this.colorIndexSelected++
      }
      else{
        this.colorIndexSelected=0
      } 
      this.emitChangeColorInServer()     
    },
    previousColorIndex(){
      if (this.colorIndexSelected>0){
        this.colorIndexSelected--
      }
      else{
        this.colorIndexSelected=this.colors.length-1
      } 
      this.emitChangeColorInServer()         
    }
  },
};
</script>

<style></style>
