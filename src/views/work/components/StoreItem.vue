<template>
  <div v-if="store" :class="$style.content">
    <div :class="$style.content__location">
      <p :class="$style.content__location__title">门店</p>
      <div @click="openLocalPicker">{{store.locationCode ? store.locationDesc : '请选择'}}</div>
    </div>
    <div :class="$style.content__task">
      <div :class="[$style.content__task__item, item.chosen && $style['content__task__item--focus']]" v-for="(item, index) in store.taskGroup" @click="toggleTask(store, index)">{{item.taskDesc}}</div>
    </div>
    <p :class="$style.content__header">门店订单</p>
    <div :class="[$style.content__order, store.orderCover && $style['content__order--cover']]">
      <div :class="$style.content__order__item">
        <p>热销新品</p>
        <input type="number" v-model="store.order.proNum">
      </div>
      <div :class="$style.content__order__item">
        <p>销售总额</p>
        <input type="number" v-model="store.order.amount">
      </div>
    </div>
    <p :class="$style.content__header">备注</p>
    <div :class="$style.content__textarea">
      <textarea v-model="store.remark" placeholder="请填写备注信息"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import * as WorkType from '../model/index'

  @Component
  export default class StoreItem extends Vue {
    public store: WorkType.Store | null = null
    @Prop(Object) public value!: WorkType.Store
    @Prop(Function) public toggleTask!: () => void
    @Prop(Function) public openLocalPicker!: () => void
    @Watch('store', { deep: true })
    public storeChanged (val: WorkType.Store, oldVal: WorkType.Store) {
      this.$emit('input', val)
    }
    public setLocalStore (): void {
      let tmpStore: WorkType.Store = JSON.parse(JSON.stringify(this.value))
      this.store = tmpStore
    }
    public created () {
      this.setLocalStore()
    }
  }
</script>

<style lang="less" module>
  .content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    color: #666;
    &__location {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      margin-top: 10px;
      padding: 0 22px 0 10px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      color: #ff6c47;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        display: inline-block;
        width: 18px;
        height: 100%;
        background: url('@/assets/common/rightArrow.png') no-repeat left center;
        background-size: 8px 12px;
      }
      &__title { color: #333; }
    }
    &__task {
      padding-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      color: #666;
      &__item {
        margin-top: 10px;
        margin-left: 10px;
        padding: 5px 12px;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        &--focus {
          border-color: #ff6c47;
          color: #ff6c47;
        }
      }
    }
    &__header {
      line-height: 40px;
      margin-top: 10px;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      color: #333;
    }
    &__textarea {
      width: 100%;
      height: 90px;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #fff;
      textarea {
        display: block;
        width: 100%;
        height: 70px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        resize: none;
        background-color: #fbfbfb;
        font-size: 14px;
        color: #333;
      }
    }
    &__order {
      position: relative;
      padding: 15px 10px;
      background-color: #fff;
      &__item {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
        &:first-of-type { margin-top: 0; }
        input {
          padding: 3px 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      }
      &--cover:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        margin-bottom: -1px;
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: 0.3;
      }
    }
  }
</style>
