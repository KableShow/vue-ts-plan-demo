<template>
  <div class="hello">
    <h1>{{ msg | formatAdd }}</h1>
    <h2>Essential Links</h2>
    <div>
      <label for="money">money: </label>
      <input id="money" type="text" :value="money" @input="filterMoney" style="border: 1px solid #39f;">
    </div>
    <ul>
      <li>country: {{country}}</li>
      <li>money: {{money}}</li>
    </ul>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component, { createDecorator } from 'vue-class-component'
import { Emit, Inject, Model, Prop, Provide, Watch } from 'vue-property-decorator'
import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'

function showMe (age: number): string {
  return 'yes you' + age
}

/**
 * decorator of a watch function
 * @param  path the path or the expression to observe
 * @param  WatchOption
 * @return MethodDecorator
 */
// function Filters (filter: string): MethodDecorator {
//   return createDecorator((componentOptions, handler) => {
//     console.log('fff', componentOptions, handler)
//     if (typeof componentOptions.filters !== 'object') {
//       componentOptions.filters = Object.create(null)
//     }
//     (componentOptions.filters as any)[filter] = handler
//   })
// }


const ModuleGetter = namespace('helloWorld', Getter)
const ModuleMutations = namespace('helloWorld', Mutation)

@Component({
  // data () {
  //   return {
  //     school: 'funny'
  //   }
  // },
  filters: {
    formatAdd: function (value: string): string {
      return value + ' good job!!'
    }
  }
})
export default class HelloWorld extends Vue {
  static filters = {
    formatAdd (value: string): string {
      return value + ' good job!!'
    }
  }

  name: string = 'HelloWorld'
  msg = 'Welcome to kable\'s App'
  inNum: number = 12
  @State('country', { namespace: 'helloWorld' }) country: string
  // @ModuleGetter('money') money: number
  @ModuleGetter money: number
  @ModuleMutations('setMoney') setMoney: (m: string) => void

  doit (): void {
    showMe(1)
  }

  filterMoney (event: any): void {
    this.setMoney(event.target.value)
  }

  @Watch('inNum')
  onInNum (val: string, oldVal: string) {
    console.log('inNum', val)
  }

  async delayTime (): Promise<void> {
    // let a: any = new Promise((resolve: Function, reject?: Function) => {
    //   setTimeout(() => {
    //     console.log('yes')
    //     resolve && resolve()
    //   }, 2000)
    // })
    // let r = await a().then(() => {
    //   console.log('good job')
    // })
    let f = () => { return 1 }
    let r = await f()
    let a = 10000
    if (r > 0) { r = 8 }
    console.log('r is', r)
    return
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
