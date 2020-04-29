<template>
  <div>
  </div>
</template>
<script>
/* eslint-disable */
/**
 * countdown
 * 倒计时组件
 * 时间戳均为 秒
 */
export default {
  name: 'countdown',
  props: {
    // 服务器的当前时间，计算时差
    serverTime: {
      type: String | Number,
      required: false,
    },
    // 截止时间
    endTime: {
      type: String | Number,
      required: true,
    },
    startTime: {
      type: String | Number,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      timer: null,
      leftTime: null, // 剩余时间
      currentTime: null, // 当前时间
      timeDiffer: 0, // 时差
    };
  },
  model: {
    prop: 'leftTime',
    event: 'change'
  },
  created() {
    console.log(this.endTime);
    if(!+this.endTime) {
      this.leftTime = 0;
      return;
    };
    console.log(11);
    if (+this.serverTime){
      this.timeDiffer = parseInt(+this.serverTime - new Date().getTime() / 1000, 0);
    };
    if (this.startTime > parseInt(new Date().getTime() / 1000 + this.timeDiffer, 0)) {
      this.leftTime = '活动还未开始';
      return;
    }
    if (this.endTime < parseInt(new Date().getTime() / 1000 + this.timeDiffer, 0)) {
      this.leftTime = '活动已结束';
      return;
    }
    this.timer = setInterval(() => {
      if (this.leftTime === 0) {
        clearInterval(this.timer);
      };
      this.timeDown();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {},
  computed: {
  },
  watch: {
    leftTime(val) {
      this.$emit('change', val);
    },
  },
  methods: {
     // 计时
    timeDown() {
      const nowTime = new Date().getTime() / 1000;
      const leftTime = parseInt(
        +this.endTime - nowTime - this.timeDiffer,
        0
      );
      this.leftTime = leftTime < 0 ? 0 : leftTime;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
