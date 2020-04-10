<template>
  <div class="stats">
    <Background class="bg"></Background>
    <h3>欢迎进入后台博客管理系统</h3>
  </div>
</template>

<script>
import Background from './Background.vue'
  export default {
    props:[''],
    data () {
      return {

    }
    },

    methods: {

    },

    components:{
      Background
    }
  }

</script>
<style scoped lang='less'>
.stats{
  font-family: 'Montserrat', sans-serif;
  width: 100%;
  height: 100%;
  position: relative;
  h3 {
    text-transform: uppercase;
    font-weight: 900;
    letter-spacing: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0;
    background: linear-gradient(-45deg, #ee7752, #e74c7e, #23a6d5, #23d5ab);
    background-size: 300% 300%;
    animation: gradientBG 10s ease-in-out infinite;
    // background-size: cover;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
  }
}
@keyframes gradientBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
</style>