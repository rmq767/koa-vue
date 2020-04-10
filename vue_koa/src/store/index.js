import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_USER: 'SET_USER'
}
const COVER_URL = [
  require('../assets/cover.jpg'),
  require('../assets/cover2.jpg'),
  require('../assets/cover3.jpg')
]

const state = {
  isAuthenticated: false,
  user: {},
  isPlaying: false,
  coverUrl: '',
  isCollapse:false,
  see:0,
  like:0
}

const getters = {
  isAuthenticated: state => state.isAuthenticated,
  user: state => state.user,
  breadListState(){
    return JSON.parse(sessionStorage.getItem('breadListStorage')) || [];
  }
}

const mutations = {
  [types.SET_AUTHENTICATED](state, isAuthenticated) {
    //设置了一个方法，名字为types.SET_AUTHENTICATED。参数为state, isAuthenticated
    if (isAuthenticated) { //判断是否授权
      state.isAuthenticated = isAuthenticated
    } else {
      state.isAuthenticated = false
    }
  },
  [types.SET_USER](state, user) {
    if (user) { //判断user是否存在
      state.user = user
    } else {
      state.user = {}
    }
  },
  togglePlay (state, toggle) {
    state.isPlaying = toggle !== undefined ? toggle : !state.isPlaying
  },
  changeCover (state) {
    while (1) {
      const index = Math.floor(Math.random() * 3)
      const coverUrl = COVER_URL[index]
      if (coverUrl !== state.coverUrl) {
        state.coverUrl = coverUrl
        break
      }
    }
  },
  isCollapse(state){//改变侧边栏的收放
    state.isCollapse = !state.isCollapse//页面大于992，用侧边栏
  },
  breadListMutations(getters,list){
    getters.breadListState=list;
    sessionStorage.setItem('breadListStorage',list);
  },
  addSee(state){
    state.see++
  },
  addLike(state){
    state.like++
  }
}

const actions = {
  setAuthenticated: ({ commit }, isAuthenticated) => { //授权
    commit(types.SET_AUTHENTICATED, isAuthenticated)
  },
  setUser: ({ commit }, user) => { //用户
    commit(types.SET_USER, user)
  },
  clearCurrentState: ({ commit }) => { //清除当前状态
    commit(types.SET_AUTHENTICATED, false)
    commit(types.SET_USER, null)
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})