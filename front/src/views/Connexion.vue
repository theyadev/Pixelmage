<template>
  <div class="main-container">
    <div class="centered-in-container">
      <div class="connexion-card">
        <div class="flex flex-col items-center">
          <span class="text-xs">logo pixelmage</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 mb-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
              clip-rule="evenodd"
            />
          </svg>
          <div v-if="game_id" class="text-center">
            <span class="font-bold">Rejoindre une partie</span>
            <p class="text-center">
              Vous pouvez rejoindre la partie en précisant votre pseudonyme et
              en cliquant sur "Rejoindre la partie" !!
            </p>
          </div>
          <div v-else class="text-center">
            <span class="font-bold">Creer une partie</span>
            <p class="text-center">
              Vous pouvez creer une partie pour jouer avec vos amis !!
            </p>
          </div>
        </div>
        <div class="mt-5">
          <p class="text-sm font-medium pb-2.5">Pseudonyme</p>
          <input
            type="text"
            v-model="username"
            placeholder="e.g Theya"
            class="w-full mb-3 text-white bg-white border-none rounded bg-opacity-10"
          />
          <div v-if="game_id" @click="joinGame" class="btn-join-create">
            Rejoindre la partie
          </div>
          <div v-else class="space-y-4">
            <div class="space-y-1">
              <h4>Créer une partie</h4>
              <div class="grid grid-cols-2 gap-2">
                <div
                  @click="createGame('public')"
                  class="flex items-center justify-center w-full py-2 space-x-2 bg-red-500 rounded cursor-pointer "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fill-rule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>Publique</span>
                </div>
                <div
                  @click="createGame('private')"
                  class="flex items-center justify-center w-full py-2 space-x-2 bg-green-500 rounded cursor-pointer "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clip-rule="evenodd"
                    />
                    <path
                      d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                    />
                  </svg>
                  <span>Privée</span>
                </div>
              </div>
            </div>
            <router-link to="/publics"  class="flex items-center justify-center w-full py-2 space-x-2 bg-pink-500 rounded cursor-pointer ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Liste des parties publiques</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.socket.on("ERROR", (data) => {
      if (data.error) {
        this.$toasted.error(data.error, {
          theme: "toasted-primary",
          position: "top-center",
          duration: 1000,
        });

        this.socket.off("CREATED")
        this.socket.off("JOINED")
      }
    });
  },
  data() {
    return {
      socket: this.$store.state.socket,
      username: "",
      game_id: this.$route.query.id,
      id: Math.floor(Math.random() * 1000000000),
    };
  },
  methods: {
    notValidUsername() {
      return !this.username || this.username.length < 4 || this.username.length > 12;
    },
    redirect(id) {
      this.$store.state.username = this.username;
      this.socket.off("ERROR");
      this.$router.push({ path: "/create", query: { id: id } });
    },
    createGame(type) {
      if (this.notValidUsername()) {
        return this.$toasted.error("Le pseudonyme doit faire entre 4 et 12 lettres !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 1000,
        });
      }

      this.socket.once("CREATED", () => this.redirect(this.id));

      this.socket.emit("CREATE", {
        id: this.id,
        name: this.username,
        type
      });
    },
    joinGame() {
      if (this.notValidUsername()) {
        return this.$toasted.error("Username too short !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 1000,
        });
      }
      this.socket.once("JOINED", () => this.redirect(this.game_id));

      this.socket.emit("JOIN", {
        id: parseInt(this.game_id),
        name: this.username,
      });
    },
  },
};
</script>

<style></style>
