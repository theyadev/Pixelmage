<template>
  <div class="grid grid-cols-1 lg:grid-cols-3">
    <div class="lg:col-start-2 flex flex-col items-center">
    <h1 class="mt-10 mb-10 text-5xl text-white">Pixelmage</h1> 
    <div
      class="
        relative
        rounded-2xl
        shadow-xl
        bg-black-700
        flex flex-col
        items-center
        p-10
        space-y-3
      "
    >
      <div class="text-white">Nom d'utilisateur</div>
      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="
          w-4/5
          px-4
          py-1
          rounded-full
          ring-1 ring-white
          transition
          duration-500
          focus:border-none
          focus:outline-none
          focus:ring-2
          focus:ring-opacity-80
          focus:shadow-lg
        "
      />
      <button
        @click="joinGame"
        class="ring-purple-700 btn w-2/4 flex justify-center"
      >
        <span class="font-medium uppercase text-purple-700">Jouer</span>
      </button>
      <button
        @click="createGame"
        class="ring-yellow-600 btn flex justify-center"
      >
        <span class="font-medium uppercase text-yellow-600"
          >Créer une salle</span
        >
      </button>
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
      console.log(this.username);
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
