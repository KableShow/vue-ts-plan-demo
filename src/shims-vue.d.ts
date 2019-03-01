import Vue from 'vue';

declare module '*.vue' {
  export default Vue;
}

// 声明全局方法
declare module 'vue/types/vue' {
  interface Vue {
    $toast: any,
    $messagebox: any,
    $modal: any
  }
}
