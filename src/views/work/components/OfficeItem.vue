<template>
  <div v-if="office" :class="$style.content">
    <div :class="$style.content__location">
      <p :class="$style.content__location__title">办事处</p>
      <div @click="openLocalPicker">{{office.locationCode ? office.locationDesc : '请选择'}}</div>
    </div>
    <div :class="$style.content__task">
      <div :class="[$style.content__task__item, item.chosen && $style['content__task__item--focus']]" v-for="(item, index) in office.taskGroup" @click="toggleTask(office, index)">{{item.taskDesc}}</div>
    </div>
    <p :class="$style.content__header">工作说明</p>
    <div :class="$style.content__textarea">
      <textarea v-model="office.remark" placeholder="请填写备注信息"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import * as WorkType from '../model/index'

  @Component
  export default class OfficeItem extends Vue {
    public office: WorkType.Office | null = null
    @Prop(Object) public value!: WorkType.Office
    @Prop(Function) public openLocalPicker!: () => void
    @Prop(Function) public toggleTask!: () => void
    @Watch('office', { deep: true })
    public officeChanged (val: WorkType.Office, oldVal: WorkType.Office) {
      this.$emit('input', val)
    }
    public setLocalOffice () {
      let tmpOffice: WorkType.Office = JSON.parse(JSON.stringify(this.value))
      this.office = tmpOffice
    }

    public created () {
      this.setLocalOffice()
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
  }
</style>
