<template>
  <div class="grid grid-cols-1 md:grid-cols-8 h-full">
    <div
      class="
        md:row-span-2
        md:col-span-2
        lg:col-span-1
        lg:row-span-1
        bg-red-400
        flex flex-col
        items-center
        space-y-4
        py-5
        px-2
      "
    >
      <div
      
        v-for="user in users"
        :key="user.username"
        class="py-2 px-6 bg-white rounded w-full flex flex-col items-center"
      >
        <div class="flex items-center space-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clip-rule="evenodd"
            />
          </svg>
          <span>{{ user.username }}</span>
        </div>
        {{ user.score }} points
        <!-- -->
      </div>
    </div>
    <div class="md:col-span-6 lg:col-span-5 bg-black-600 pb-10 lg:pb-0">
      <div class="flex flex-col items-center justify-center pt-5 space-y-8">
        <div class="relative flex items-center">
          <Timer
            v-if="current > 0"
            :max="max"
            :current="current"
            class="absolute -left-48 top-1 w-14 h-14"
          />
          <div class="text-white font-bold text-5xl">
            _ _ _&nbsp;&nbsp;_ _ _&nbsp;&nbsp;_ _
          </div>
        </div>
        <img src="/testimg.jpg" class="w-8/12 rounded-lg" />
        <form @submit.prevent="submitAnswer" class="w-full flex justify-center">
          <input
            v-model="reponse"
            type="text"
            class="rounded-full w-5/12 text-center font-medium"
          />
        </form>
      </div>
    </div>
    <div
      class="md:col-span-6 lg:col-span-2 flex flex-col bg-black-400 px-5 py-5"
    >
      <div class="flex-grow h-80 overflow-y-auto mb-5 space-y-5 hide-scroll">
        <div
          v-for="(message, i) in chat"
          :key="message.author + i"
          class="flex"
          :class="message.author == username ? 'justify-end' : ''"
        >
          <div>
            <span
              class="text-white flex px-1 pb-0.5"
              :class="message.author == username ? 'justify-end' : ''"
              >{{ message.author }}</span
            >
            <div
              class="py-2 px-4 rounded-lg flex justify-center"
              :class="
                message.author == username
                  ? 'bg-white rounded-bl-2xl'
                  : 'bg-pink-500 rounded-br-2xl'
              "
            >
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
      <div class="relative flex items-center justify-end">
        <form @submit.prevent="sendMessage" class="w-full flex items-center">
          <button
            type="submit"
            class="
              absolute
              right-2
              cursor-pointer
              rounded-lg
              transition
              duration-500
              hover:bg-black-50 hover:bg-opacity-50
            "
          >
            <svg
              class="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          <input class="px-4 py-1 w-full rounded-lg pr-10" v-model="message" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from "../components/Timer.vue";
export default {
  mounted() {
    this.socket.on("UPDATED", (room) => {
      // TODO: Verifier si le sort marche xD

      function sortThing(a, b) {
        return a.score - b.score
      }

      this.users = room.users.sort(sortThing)

      this.chat = room.chat
    });

    this.socket.on("CHAT", (chat) => {
      this.chat = chat
    })

    this.socket.emit("UPDATE", {
      id: parseInt(this.id),
    });
    //   socket.on('UPDATETIME', (currentTime) => {
    //       this.current = currentTime
    //   })
  },
  components: {
    Timer,
  },
  methods: {
    submitAnswer() {
      this.reponse = "";
    },
    sendMessage() {
      this.socket.emit("MESSAGE", {
        id: this.id,
        username: this.username,
        message : this.message
        })
      this.message = "";
    },
  },
  data() {
    return {
      socket: this.$store.state.socket,
      id: parseInt(this.$route.query.id),
      username: this.$store.state.username,
      current: 0,
      max: 10,
      users: null,
      chat: null,
      reponse: "",
      message: "",
      answer: "Mickey",
    };
  },
};
</script>

<style>
.hide-scroll::-webkit-scrollbar {
  display: none;
}
</style>
