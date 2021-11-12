<template>
  <div class="flex flex-col flex-grow items-center">
    <h1 class="mt-10 mb-10 text-5xl text-white">Pixelmage</h1>
      <div
        v-if="error"
        class="
          absolute
          flex
          items-center
          space-x-4
          text-white
          bg-red-600
          px-5
          py-2
          rounded-full
          ring-2 ring-red-900
          shadow
        "
      >
        <span>{{ error }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 cursor-pointer"
          @click="error = ''"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    <div
      class="
        relative
        w-1/4
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
</template>

<script>
export default {
  mounted() {
    this.socket.on("ERROR", (data) => {
      if (data.error) {
        this.error = data.error
      }
    })

    this.socket.on("JOINED", () => {
      this.$store.state.username = this.username;
      this.$router.push({ path: "/create", query: { id: this.game_id } });
    });
  },
  data() {
    return {
      socket: this.$store.state.socket,
      username: "",
      game_id: this.$route.query.id,
      error: "",
      id: Math.floor(Math.random() * 1000000000),
    };
  },
  methods: {
    notValidUsername() {
      return !this.username || this.username.length < 4;
    },
    createGame() {
      console.log(this.username);
      if (this.notValidUsername()) return;

      this.socket.once("CREATED", () => {
        this.$store.state.username = this.username;
        this.$router.push({ path: "/create", query: { id: this.id } });
      });

      this.socket.emit("CREATE", {
        id: this.id,
        name: this.username,
      });
    },
    joinGame() {
      if (this.notValidUsername()) return;

      this.socket.emit("JOIN", {
        id: parseInt(this.game_id),
        name: this.username,
      });
    },
  },
};
</script>

<style></style>
