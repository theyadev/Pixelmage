<template>
  <time :style="gradient"></time>
</template>

<script>
import { DateTime, Duration } from "luxon";

export default {
  data() {
    return {
      start: DateTime.local(),
      now: DateTime.local().plus({ seconds: this.current }),
      end: DateTime.local().plus({ seconds: this.max }),
      tick: 20,
    };
  },
  props: ["max", "current"],
  watch: {
    max: function () {
      this.end = DateTime.local().plus({ seconds: this.max });
    },
    current: function () {
        this.now = this.start.plus({ seconds: this.current })
    }
  },
  computed: {
    total() {
      return this.end.diff(this.start).toObject();
    },
    remaining() {
      return this.end.diff(this.now).toObject();
    },
    elapsed() {
      return this.now.diff(this.start).toObject();
    },
    percent() {
      return (this.elapsed.milliseconds / this.total.milliseconds) * 100;
    },
    display() {
      return Duration.fromObject(this.remaining).toFormat("hh:mm:ss");
    },
    finished() {
      return this.now >= this.end;
    },
    gradient() {
      return {
        background: `radial-gradient(black 60%, transparent 61%), conic-gradient(#EF4444 0% ${this.percent}%, transparent ${this.percent}% 100%)`,
      };
    },
  },
};
</script>

<style>
time {
  border-radius: 50%;
  height: 40vh;
  width: 40vh;
}
</style>
