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
          <select class="rounded-full py-0.5 px-5">
            <option v-for="categorie in categories" :key="categorie">
              {{ categorie }}
            </option>
          </select>
        </div>
        <div class="flex flex-col items-center space-y-2">
          <div class="text-white">Nombre de rounds</div>
          <select class="rounded-full py-0.5 px-6">
            <option v-for="i in 6" :key="i">{{ i + 4 }}</option>
          </select>
        </div>
        <button class="ring-purple-700 btn flex justify-center">
          <span class="font-medium uppercase text-purple-700"
            >Démarrer la partie</span
          >
        </button>
        <input
          type="text"
          :value="id"
          class="
            text-red-600
            ring-red-600 ring-1
            relative
            shadow-md
            px-10
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
                group-hover:opacity-100
                pointer-events-none
                transition
                duration-300
                transform
                translate-y-7
                scale-50
                group-hover:-translate-y-0 group-hover:scale-100
              "
            >
              {{ users[i - 1] }}
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
  props: ["username"],
  mounted() {
    console.log(this.username);
    console.log(this.$route.params);
    this.socket.on("JOINED", () => {
      console.log("HELLO WORLDU SAMA");
    });
  },
  data() {
    return {
      socket: this.$store.state.socket,
      id: this.$route.query.id,
      categories: ["Anime", "Disney", "Célébrités"],
      users: [
        "Theya le méchant",
        "Dark",
        "Overangelix",
        "Dioscure",
        "Makaron",
        "Volca",
        "Cookie",
      ],
      url: "/join?id=",
    };
  },
};
</script>

<style></style>
