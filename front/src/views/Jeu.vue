<template>
  <div class="flex flex-col h-screen w-screen bg-black-600 bg-opacity-95 pt-20">
    <div class="grid grid-cols-1 md:grid-cols-8 h-full">
      <div
        class="
          md:row-span-2 md:col-span-2
          lg:col-span-1 lg:row-span-1
          bg-red-500
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
          <div class="relative flex flex-col items-center text-center">
            <Timer
              :max="max"
              :current="max - current"
              class=" top-1 w-14 h-14"
            />
            <div class="text-white text-center font-bold text-5xl px-5">
              {{ hiddenAnswer }}
            </div>
          </div>
          <div class="flex justify-center">
            <canvas
              id="canvas"
              class="w-8/12 rounded-lg object-contain lg:max-h-96"
            />
            <canvas
              id="canvasInvisible"
              class="w-8/12 rounded-lg object-contain lg:max-h-96 hidden"
            />
          </div>
          <form
            @submit.prevent="submitAnswer"
            class="w-full flex justify-center"
          >
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
        <div
          class="flex-grow h-80 overflow-y-auto mb-5 space-y-5 hide-scroll"
          id="chat"
        >
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
                :style="'background-color:' + getColor(message.author)"
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

            <input
              class="px-4 py-1 w-full rounded-lg pr-10"
              v-model="message"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from "../components/Timer.vue";
export default {
  created() {
    window.addEventListener("beforeunload", this.handleRefresh);
  },
  mounted() {
    if (this.$store.state.username == null) {
      this.$router.push({ path: "/" });
    }
    this.socket.on("UPDATED", (room) => {
      // TODO: Verifier si le sort marche

      function sortThing(a, b) {
        return b.score - a.score;
      }

      this.users = room.users.sort(sortThing);

      this.chat = room.chat;

      const img = new Image();

      img.src = room.image;

      this.image = img;

      this.max = room.maxTime;

      this.hiddenAnswer = room.answer;
    });

    this.socket.on("CHAT", (chat) => {
      // Update chat
      this.chat = chat;

      // Scroll at the end of the chat
      const chatDiv = document.getElementById("chat");
      setTimeout(()=>{
        chatDiv.scrollTop = chatDiv.scrollHeight
      },0)
      
    });

    this.socket.emit("UPDATE", {
      id: parseInt(this.id),
    });

    this.socket.on("UPDATE TIMER", (currentTime, finished = false) => {
      this.current = currentTime;

      if (finished) {
        this.pixelate(1, true);
      } else {
        this.pixelate((this.current / this.max) * 0.1);
      }
    });

    this.socket.once("QUIT TO LOBBY", () => {
      console.log("QUITTER");
      this.$router.push({ path: "/create", query: { id: this.id } });
    });
  },
  components: {
    Timer,
  },
  methods: {
    pixelate(scale, finished = false) {
      var canvas2 = document.getElementById("canvasInvisible");
      var canvas = document.getElementById("canvas");

      canvas.width = this.image.width;
      canvas.height = this.image.height;

      canvas2.width = this.image.width;
      canvas2.height = this.image.height;

      var scaledW = canvas.width * scale;
      var scaledH = canvas.height * scale;

      var ctx = canvas.getContext("2d");
      var ctx2 = canvas2.getContext("2d");

      ctx.mozImageSmoothingEnabled = false;
      ctx.webkitImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;

      if (this.image.height == 0 || this.image.width == 0) return;

      ctx2.clearRect(0, 0, scaledW, scaledH);
      ctx2.drawImage(this.image, 0, 0, scaledW, scaledH);

      ctx.clearRect(0, 0, scaledW, scaledH);
      ctx.drawImage(
        canvas2,
        0,
        0,
        scaledW,
        scaledH,
        0,
        0,
        this.image.width,
        this.image.height
      );
    },
    submitAnswer() {
      const index = this.users.findIndex((e) => e.username == this.username);

      if (this.users[index].answered == true) {
        return this.$toasted.show("Vous avez déjà répondu !", {
          theme: "toasted-primary",
          containerClass: "test",
          position: "top-center",
          duration: 500,
        });
      }

      this.socket.once("GOOD ANSWER", () => {
        this.$toasted.success("Bonne réponse !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 5000,
        });
        this.socket.off("WRONG ANSWER");
        this.socket.off("NEAR ANSWER");
      });

      this.socket.once("WRONG ANSWER", () => {
        this.$toasted.error("Mauvaise réponse !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 2000,
        });
        this.socket.off("GOOD ANSWER");
        this.socket.off("NEAR ANSWER");
      });

      this.socket.once("NEAR ANSWER", () => {
        this.$toasted.show("Close one !", {
          theme: "toasted-primary",
          position: "top-center",
          duration: 2000,
        });
        this.socket.off("GOOD ANSWER");
        this.socket.off("WRONG ANSWER");
      });

      this.socket.emit("ANSWER", {
        id: this.id,
        name: this.username,
        answer: this.reponse,
      });

      this.reponse = "";
    },
    sendMessage() {
      this.socket.emit("MESSAGE", {
        id: this.id,
        username: this.username,
        message: this.message,
      });
      this.message = "";
    },
    getColor(username) {
      const index = this.users.findIndex((e) => e.username == username);
      return "#" + this.users[index].color;
    },
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
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.handleRefresh);
  },
  beforeRouteLeave(to, from, next) {
    console.log(to.name);
    if (to.name != "Creation Partie") this.quit();

    next();
  },
  data() {
    return {
      socket: this.$store.state.socket,
      id: parseInt(this.$route.query.id),
      username: this.$store.state.username,
      current: 0,
      max: 60,
      users: null,
      chat: null,
      image: "",
      reponse: "",
      message: "",
      answer: "",
      hiddenAnswer: "",
    };
  },
};
</script>

<style>
.hide-scroll::-webkit-scrollbar {
  display: none;
}
.hide-scroll {
  scroll-behavior: auto;
}
</style>
