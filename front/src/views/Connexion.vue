<template>
  <div class="flex flex-col h-screen w-screen bg-black bg-opacity-95">
    <div class="bg-opacity-95 flex flex-grow items-center justify-center">
      <div
        class="
          w-80
          md:w-96
          rounded
          shadow
          bg-white bg-opacity-5
          text-white
          py-10
          px-10
          flex flex-col
        "
      >
        <div class="flex flex-col items-center">
          <span class="text-xs">logo pixelmage</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-16 w-16 mb-5"
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
            class="
              rounded
              mb-3
              border-none
              w-full
              bg-white bg-opacity-10
              text-white
            "
          />
          <div v-if="game_id" @click="joinGame" class="btn-join-create">
            Rejoindre la partie
          </div>
          <div v-else @click="createGame" class="btn-join-create">
            Creer une partie
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
      return !this.username || this.username.length < 4;
    },
    redirect(id) {
      this.$store.state.username = this.username;
      this.socket.off("ERROR");
      this.$router.push({ path: "/create", query: { id: id } });
    },
    createGame() {
      if (this.notValidUsername()) {
        return this.$toasted.error("Username too short !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 1000,
        });
      }

      this.socket.once("CREATED", () => this.redirect(this.id));

      this.socket.emit("CREATE", {
        id: this.id,
        name: this.username,
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
