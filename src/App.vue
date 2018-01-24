<template>
  <div id="app" class="app-container">
    <!-- <img src="./assets/logo.png"> -->
    <router-view/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class App extends Vue {
  name: string = 'app'
}
</script>

<style lang="less" src="@/style/reset.less"></style>
