<template>
    <div class="container">
    <input type="text" v-model="title" />
    <div class="search"></div>
    </div>
</template>

<script>
// 节流函数
const delay = (function() {
    let timer = 0;
    return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
    };
})();
export default {
    data() {
    return {
        title: '',
        search:[],
    };
    },
    watch: {
    title() {
      delay(() => {
      this.fetchData()
      delay(() => {
      this.search_articles();
      }, 100);
      }, 500)
    },
    },
    methods: {
    fetchData() {
        this.$http.get('/article/search?search='+this.title)
        .then(res =>{
        this.search = res.data
        })
    },
    search_articles(){
      this.$emit('searchTitle',this.search)
    }
    },
    // updated() {
    //   this.search_articles()
    // },
};
</script>

<style scoped lang='less'>
.container {
  position: absolute;
  margin: auto;
  top: -4vh;
  right: -10vw;
  width: 300px;
  height: 60px;
}
.container .search {
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  transition: all 1s;
  z-index: 4;
  box-shadow: 0 0 3px 0 #778899;
}
.container .search:hover {
  cursor: pointer;
}
.container .search::before {
  content: "";
  position: absolute;
  margin: auto;
  top: 22px;
  right: 0;
  bottom: 0;
  left: 22px;
  width: 12px;
  height: 2px;
  background: #ccc;
  transform: rotate(45deg);
  transition: all .5s;
}
.container .search::after {
  content: "";
  position: absolute;
  margin: auto;
  top: -5px;
  right: 0;
  bottom: 0;
  left: -5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 2px solid #ccc;
  transition: all .5s;
}
.container input {
  font-family: 'Inconsolata', monospace;
  position: absolute;
  margin: auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100px;
  height: 50px;
  outline: none;
  border: none;
  background: white;
  color: #778899;
  padding: 0 40px 0 20px;
  border-radius: 30px;
  box-shadow: 0 0 5px 0 #ccc;
  transition: all 1s;
  opacity: 0;
  z-index: 5;
  font-weight: bolder;
  letter-spacing: 0.1em;
}
.container input:hover {
  cursor: pointer;
}
.container input:focus {
  width: 14vw;
  transform: translateX(-7vw);
  opacity: 1;
  cursor: text;
}
.container input:focus ~ .search {
  right: 0px;
  background: #ccc;
  z-index: 6;
}
.container input:focus ~ .search::before {
  top: 0;
  left: 0;
  width: 25px;
  background: white;
}
.container input:focus ~ .search::after {
  top: 0;
  left: 0;
  width: 25px;
  height: 2px;
  border: none;
  background: white;
  border-radius: 0%;
  transform: rotate(-45deg);
}
.container input::placeholder {
  color: white;
  opacity: 0.5;
  font-weight: bolder;
}
</style>
