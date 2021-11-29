<template>
  <div class="flex flex-col h-screen w-screen bg-black bg-opacity-95">
    <div class="bg-opacity-95 flex flex-grow items-center justify-center">
      <div
        class="
          w-10/12
          md:w-7/12
          lg:w-2/5
          rounded
          shadow
          bg-white bg-opacity-5
          text-white
          py-10
          px-10
          flex flex-col
          space-y-5
        "
      >
        <div class="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mb-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13 7H7v6h6V7z" />
            <path
              fill-rule="evenodd"
              d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-bold">Configuration de la partie</span>
          <p class="text-center">
            Tout les parametres sont a votre disposition pour creer la meilleure
            des parties !!
          </p>
        </div>
        <div class="w-full h-px bg-white"></div>
        <div class="flex space-x-10">
          <div>
            <div>Catégorie</div>
            <div class="relative">
              <div
                class="
                  mt-2
                  h-8
                  bg-white
                  text-black-900
                  flex
                  items-center
                  justify-between
                  px-4
                  py-4
                  w-40
                  relative
                "
                :class="[
                  dropdownCategories ? 'rounded-t' : 'rounded',
                  host ? 'cursor-pointer' : 'cursor-default opacity-60',
                ]"
                v-on="{
                  [host ? 'click' : null]: () => {
                    dropdownCategories = !dropdownCategories;
                  },
                }"
              >
                <div>{{ inlineCategories().length > 0 && inlineCategories()[0].length > 10? inlineCategories()[0].slice(0, 10) + "..." : inlineCategories()[0] }} <span v-if="inlineCategories().length - 1 > 0">+{{inlineCategories().length - 1 }}</span></div>

                <svg
                  class="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>          
              <div
                v-if="dropdownCategories"
                class="
                  absolute
                  bg-white
                  rounded-b
                  z-20
                  text-black-900
                  flex-col
                  justify-between
                  py-0.5
                  w-40
                  divide-y
                "
              >
                <div
                  @click="checkAll"
                  class="px-4 cursor-pointer flex justify-between"
                >
                  <div>Tout</div>
                  <svg
                    v-if="allActive()"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div
                  v-for="categorie in categories"
                  :key="categorie.name"
                  @click="checkCategory(categorie)"
                  class="px-4 cursor-pointer flex justify-between"
                >
                  <div>
                    {{ categorie.name }}
                  </div>
                  <svg
                    v-if="categorie.active"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>Rounds</div>
            <select
              class="text-black-900 rounded mt-2 py-1"
              v-model="maxRounds"
              :disabled="!host"
              @change="updateGameMaxRounds"
            >
              <option v-for="i in 6" :key="i">{{ i + 4 }}</option>
            </select>
          </div>
          <div>
            <div>Durée des rounds</div>
              <select
              class="text-black-900 rounded mt-2 py-1"
              v-model="maxRounds"
              :disabled="!host"
              @change="updateGameMaxRounds"
            >
              <option v-for="i in 6" :key="i">{{ i*10 + 20 }}</option>
            </select>
          </div>
        </div>
        <div class="w-full h-px bg-white"></div>
        <div class="grid grid-cols-6 gap-4">
          <div
            class="
              col-span-2
              w-full
              py-2
              rounded
              flex
              bg-white bg-opacity-5
              justify-center
              items-center
              space-x-2
              cursor-pointer
            "
            @click="leave"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
            <div>Quitter</div>
          </div>
          <div
            class="
              w-full
              py-2
              rounded
              flex
              bg-pink-500
              justify-center
              items-center
              space-x-2
              cursor-pointer
            "
            @click="copyLink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path
                d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"
              />
            </svg>
          </div>
          <button
            :disabled="!host"
            v-on="{ [host ? 'click' : null]: startGame }"
            class="
              col-span-3
              w-full
              py-2
              rounded
              flex
              bg-gradient-to-r
              from-red-500
              to-green-500
              justify-center
              cursor-pointer
              disabled:opacity-70 disabled:cursor-default
            "
          >
            Démarrer la partie
          </button>
        </div>
        <div class="w-full h-px bg-white"></div>
        <div class="flex flex-wrap justify-center gap-3 text-black-900">
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
              class="relative h-5 w-5 text-black-300 z-10"
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

    this.socket.on("CATEGORIES", (categories) => {
      if (this.host == true) {  
        this.categories = categories.map((e) => {
          return {
            name: e,
            active: false,
          };
        });
      
        this.updateCategories()
      }
    });

    this.socket.on("UPDATED", (room) => {
      if (room.started == true) {
        this.socket.off("UPDATED");
        this.$router.push({ path: "/game", query: { id: room.id } });
        return;
      }

      let users = room.users;

      this.maxRounds = room.maxRounds;
      this.categories = room.categories;

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

    this.socket.emit("GET CATEGORIES");
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
      categories: [],
      starting: false,
      users: [],
      host: false,
      dropdownCategories: false,
      maxRounds: 5,
      colors: [
        "FF0000",
        "FF3E00",
        "FFD800",
        "1FFF00",
        "00FFCD",
        "009BFF",
        "004DFF",
        "0008FF",
        "6400FF",
        "C500FF",
        "FB71C3",
        "D57700",
        "BEE800",
        "016A23",
        "12003D",
        "3D0038",
        "4C0000",
        "F09761",
        "4F4640",
        "9AA4CA",
      ],
      colorIndexSelected: 0,
    };
  },
  methods: {
    updateCategories(){
      this.socket.emit("UPDATE CATEGORY", {
        categories: this.categories,
        id: this.id,
      });
    },
    checkCategory(categorie) {
      categorie.active = !categorie.active;
      this.updateCategories()
    },
    inlineCategories() {
      let catNames = this.categories.map((e) => {
        if (e.active) return e.name;
      });

      return catNames.filter((e) => e);
    },
    anyActive() {
      return this.categories.some((e) => e.active);
    },
    allActive() {
      return this.categories.every((e) => e.active);
    },
    checkAll() {
      if (this.allActive()) {
        this.categories.forEach((e) => {
          e.active = false;
        });
      } else {
        this.categories.forEach((e) => {
          e.active = true;
        });
      }
      this.updateCategories()
    },
    handleRefresh(event) {
      this.quit();
      event.stopImmediatePropagation();
      event.preventDefault();
    },
    leave() {
      this.quit();
      this.$router.push("/");
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
    updateGameMaxRounds(event) {
      this.socket.emit("UPDATE MAX ROUNDS", {
        maxRounds: event.target.value,
        id: this.id,
      });
    },
    copyLink() {
      const url = this.$store.state.BASE_URL + "/?id=" + this.id;
      navigator.clipboard.writeText(url);
      this.$toasted.success("Copied !", {
        theme: "toasted-primary",
        position: "top-center",
        duration: 1000,
      });
    },
    startGame() {
      if (this.starting) return
      if (!this.host) return;
      if (!this.anyActive()) {
        this.$toasted.error("Il faut mettre au moins une catégorie !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 1000,
        });
        return;
      }
      this.starting = true
      this.socket.emit("START", { id: this.id, categories: this.categories });
    },
    emitChangeColorInServer() {
      this.socket.emit("CHANGE COLOR", {
        id: this.id,
        name: this.$store.state.username,
        color: this.colors[this.colorIndexSelected],
      });
    },
    nextColorIndex() {
      if (this.colorIndexSelected < this.colors.length) {
        this.colorIndexSelected++;
      } else {
        this.colorIndexSelected = 0;
      }
      this.emitChangeColorInServer();
    },
    previousColorIndex() {
      if (this.colorIndexSelected > 0) {
        this.colorIndexSelected--;
      } else {
        this.colorIndexSelected = this.colors.length - 1;
      }
      this.emitChangeColorInServer();
    },
  },
};
</script>

<style></style>
