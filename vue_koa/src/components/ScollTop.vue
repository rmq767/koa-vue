<template>
  <transition name='slide-fade'>
    <div class='page-component-up' v-if='isShow' @click='getTop'>
        <unicon name="plane" fill="black" width="2rem" height="2rem"></unicon>
    </div>
  </transition>
</template>

<script>

  export default {
    props:[''],
    data () {
      return {
      isShow: false
      };
    },

    methods: {
    showIcon () {
      if (document.documentElement.scrollTop > 100) {
        this.isShow = true
      } else if (document.documentElement.scrollTop < 100) {
        this.isShow = false
      }
    },
    getTop () {
      let timer = setInterval(() => {
        let top = document.documentElement.scrollTop
        let speed = Math.ceil(top / 5)
        document.documentElement.scrollTop = top - speed
        if (top === 0) {
          clearInterval(timer)
        }
      }, 20)
    }
    },

    components: {},

    computed: {},

    mounted() {
    window.addEventListener('scroll', this.showIcon)
    },

    beforeDestroy() {
    window.removeEventListener('scroll', this.showIcon)
    },

  }

</script>
<style scoped>
.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.3, 0.8, 1.0);
  opacity: 0;
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active 在低于 2.1.8 版本中 */ {
  transform: translateY(-20px);
  opacity: 0;
}
.page-component-up {
  position: fixed;
  right: 0rem;
  bottom: 0rem;
  width: 4rem;
  height: 4rem;
  border-radius: 25px;
  cursor: pointer;
  opacity: .7;
  transition: .3s;
  text-align: center;
  z-index: 999;
}
.page-component-up svg{
  position: absolute;
  left: 0;
  top: 0;
  transform: translate(50%,50%);
}
</style>