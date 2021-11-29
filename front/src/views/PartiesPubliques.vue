<template>
  <div class="main-container">
    <div class="overflow-x-hidden">
      <div class="flex flex-wrap justify-center mt-24 bg-black-800">
        <div v-if="rooms.length == 0">
          <h1 class="text-2xl font-bold text-white"> Oups, désolé il n'y a aucune partie en cours !</h1>
        </div>
        <div
          v-for="room in rooms"
          :key="room.id"
          class="flex flex-col px-4 py-3 mx-3 my-2 space-y-2 text-white bg-white rounded bg-opacity-10 w-60"
        >
          <div class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h2 class="text-lg font-bold">
            Salle de
            <span class="text-red-500">{{
              room.users.filter((e) => e.host === true)[0].username
            }}</span>
            <p class="text-base font-normal">({{ room.users.length }}/20)</p>
          </h2>

          <div>
            <p class="font-semibold">
              Catégorie<span v-if="activeCategories(room).length > 1">s</span>
            </p>
            <p class="pl-1" v-if="activeCategories(room).length > 0">
              <span
                v-if="activeCategories(room)[0]"
                class="font-semibold text-purple-500"
                >{{ activeCategories(room)[0].name }}</span
              >
              <span
                v-if="activeCategories(room)[1]"
                class="font-semibold text-purple-500"
                >, {{ activeCategories(room)[1].name }}
              </span>
              <span v-if="activeCategories(room).length > 2"
                >, ... +{{ i }}</span
              >
            </p>
            <p v-else class="pl-1">
              <span class="font-semibold text-purple-500">Aucune</span>
            </p>
          </div>
          <div class="flex items-center space-x-2">
            <svg
              v-if="room.showCategories"
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-green-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Catégorie affichée</span>
          </div>
          <div>
            <p v-if="room.started" class="my-2 font-semibold text-pink-500">
              La partie a commencé
            </p>
            <p v-else class="my-2 font-semibold text-blue-500">Dans le lobby</p>
            <p v-if="room.started">
              Round:
              <span class="font-semibold"
                ><span class="text-green-500">{{ room.currentRound }}</span> /
                {{ room.maxRounds }}</span
              >
            </p>
            <p v-else>Nombre de round: {{ room.maxRounds }}</p>
          </div>
          <p>
            Durée du round:
            <span class="text-green-500">{{ room.maxTime }}</span> s
          </p>
          <div class="flex items-end flex-grow">
            <div
              @click="redirectTo(room.id)"
              class="flex justify-center w-full py-1 mt-2 bg-yellow-600 rounded cursor-pointer "
            >
              Rejoindre la partie
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    this.socket.emit("GET PUBLIC ROOMS");

    this.socket.on("PUBLIC ROOMS", (rooms) => {
      this.rooms = rooms;
    });
  },
  methods: {
    activeCategories(room) {
      const categories = room.categories.filter((e) => e.active === true);

      return categories;
    },
    redirectTo(id) {
      this.socket.off("PUBLIC ROOMS");

      this.$router.push({ path: "/", query: { id: id } });
    },
  },
  data() {
    return {
      socket: this.$store.state.socket,
      rooms: null,
    };
  },
};
</script>

<style></style>
