import Vue from 'vue';
import Vuex from 'vuex';
import work from '@/views/work/store'

const modules = {
  work
}

Vue.use(Vuex);

export default new Vuex.Store({
  modules
});
