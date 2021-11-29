<template>
  <div class="flex flex-col justify-center items-center">
    <div class="w-2/3 text-white text-center divide-y-2">
      <div class="py-4 px-5 font-bold text-2xl">
        CLASSEMENT FINAL
      </div>
      <div class="flex flex-col items-center pt-5">
        <div
          v-for="index in getTopUsers().length"
          :key="index"
          class="py-2 px-4 rounded-full my-2"
          :class="getColor(index)"
        >
          <div class="text-lg">{{ index }}<span class="font-bold">. {{getTopUser(0)}} </span></div>
          <div class="italic">(1050 points)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["users"],
  methods: {
    getColor(index) {
      switch (index) {
        case 1:
          return "bg-yellow-500 w-11/12";
        case 2:
          return "bg-gray-600 w-2/3";
        case 3:
          return "bg-yellow-800 w-1/2";

        default:
          return "bg-white bg-opacity-10 w-1/4";
      }
    },
    getTopUsers(){
      return this.users
    },
    getTopUser(index){
      return this.getTopUsers()[index]
    }
  },
};
</script>


<style>
</style>