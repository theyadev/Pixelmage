<template>
  <div class="grid grid-cols-8 h-full">
    <div class="bg-red-400"></div>
    <div class="col-span-5 bg-black-600">
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
        <input
          type="text"
          class="rounded-full w-5/12 text-center font-medium"
        />
      </div>
    </div>
    <div class="col-span-2 flex flex-col bg-black-400 px-5 py-5">
      <div class="flex-grow h-52 overflow-y-auto mb-5 space-y-5 hide-scroll">
        <div
          v-for="message in chat"
          :key="message"
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
        <svg @click="sendMessage()" class="w-7 h-7 absolute right-2 cursor-pointer rounded-lg transition duration-500 hover:bg-black-50 hover:bg-opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
        <input class="px-4 py-1 w-full rounded-lg pr-10" v-model="message" />
      </div>
    </div>
  </div>
</template>

<script>
import Timer from "../components/Timer.vue";
export default {
  mounted() {
    //   socket.on('UPDATETIME', (currentTime) => {
    //       this.current = currentTime
    //   })
  },
  components: {
    Timer,
  },
  data() {
    return {
      username: "Dark",
      current: 0,
      max: 10,
      chat: [
        {
          author: "Theya",
          date: "",
          content: "Zboub de bois",
        },
        {
          author: "Dark",
          date: "",
          content: "Pipo le iench il est trop cool !",
        },
        {
          author: "Dark",
          date: "",
          content:
            "Pipo le iench il est trop cool mais vraiment trop trop trop cool je le kiffe trop ce petit chien !",
        },
        {
          author: "Theya",
          date: "",
          content: "aaaaaaaaaaaaaaaaaaaaaa j'ai besoin d'aide je trouve pas",
        },
        {
          author: "Theya",
          date: "",
          content: "Zboub de bois",
        },
        {
          author: "Dark",
          date: "",
          content: "Pipo le iench il est trop cool !",
        },
        {
          author: "Dark",
          date: "",
          content:
            "Pipo le iench il est trop cool mais vraiment trop trop trop cool je le kiffe trop ce petit chien !",
        },
        {
          author: "Theya",
          date: "",
          content: "aaaaaaaaaaaaaaaaaaaaaa j'ai besoin d'aide je trouve pas",
        },
      ],
      reponse: "",
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
