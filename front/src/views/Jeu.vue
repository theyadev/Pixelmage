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
    <div class="col-span-2 bg-black-400"></div>

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
      current: 0,
      max: 10,
      chat: [],
      reponse: "",
      answer: "Mickey",
    };
  },
};
</script>

<style></style>
