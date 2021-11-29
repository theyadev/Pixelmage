<template>
  <div class="main-container">
    <div class="centered-in-container">
      <div class="create-card">
        <div class="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 mb-5"
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
            <div>Catégories</div>
            <div class="relative">
              <div
                class="categories-dropdown"
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
                <div>
                  {{ firstCategory }}
                  <span v-if="inlineCategories().length - 1 > 0"
                    >+{{ inlineCategories().length - 1 }}</span
                  >
                </div>
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
              <div v-if="dropdownCategories" class="categories-dropdown-bg">
                <div
                  @click="checkAll"
                  class="flex justify-between px-4 cursor-pointer"
                >
                  <div>Tout</div>
                  <svg
                    v-if="allActive()"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 text-green-600"
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
                  class="flex justify-between px-4 cursor-pointer"
                >
                  <div>
                    {{ categorie.name }}
                  </div>
                  <svg
                    v-if="categorie.active"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6 text-green-600"
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
              class="py-1 mt-2 rounded text-black-900"
              v-model="maxRounds"
              :disabled="!host"
              @change="updateGameMaxRounds"
            >
              <option v-for="i in 6" :key="i">{{ i}}</option>
            </select>
          </div>
          <div>
            <div>Durée des rounds</div>
            <select
              class="py-1 mt-2 rounded text-black-900"
              v-model="maxTime"
              :disabled="!host"
              @change="updateGameMaxTime"
            >
              <option v-for="i in 6" :key="i">{{ i}}</option>
            </select>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <input
            class="rounded border-opacity-20 focus:ring-transparent"
            type="checkbox"
            name="showCategories"
            v-model="showCategories"
          />
          <div>Afficher les categories en jeu ?</div>
        </div>
        <div class="w-full h-px bg-white"></div>
        <div class="grid grid-cols-6 gap-4">
          <div class="btn-leave" @click="leave">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
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
          <div class="btn-copy" @click="copyLink">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5"
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
            class="btn-start"
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
              class="relative z-10 w-5 h-5 text-black-300"
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

        this.updateCategories();
      }
    });

    this.socket.once("UPDATED", (room) => {
      this.socket.emit("GET CATEGORIES");
    })

    this.socket.on("UPDATED", (room) => {
      if (room.started == true) {
        this.socket.off("UPDATED");
        this.$router.push({ path: "/game", query: { id: room.id } });
        return;
      }

      let users = room.users;

      this.maxRounds = room.maxRounds;
      this.maxTime = room.maxTime;
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
      maxTime: 30,
      showCategories: true,
      colors: ["red-500", "green-500"],
      colorIndexSelected: 0,
    };
  },
  computed: {
    firstCategory: function () {
      const categories = this.inlineCategories();
      return categories.length > 0 && categories[0].length > 10
        ? categories[0].slice(0, 10) + "..."
        : categories[0];
    },
  },
  methods: {
    updateCategories() {
      this.socket.emit("UPDATE CATEGORY", {
        categories: this.categories,
        id: this.id,
      });
    },
    checkCategory(categorie) {
      categorie.active = !categorie.active;
      this.updateCategories();
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
      this.updateCategories();
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
    updateGameMaxTime(event) {
      this.socket.emit("UPDATE MAX TIME", {
        maxTime: event.target.value,
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
      if (this.starting) return;
      if (!this.host) return;
      if (!this.anyActive()) {
        this.$toasted.error("Il faut mettre au moins une catégorie !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 1000,
        });
        return;
      }
      this.starting = true;
      this.socket.emit("START", {
        id: this.id,
        categories: this.categories,
        showCategories: this.showCategories,
      });
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
