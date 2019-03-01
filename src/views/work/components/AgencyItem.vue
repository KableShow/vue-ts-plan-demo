<template>
  <div v-if="agency" :class="$style.content">
    <div :class="$style.content__location">
      <p :class="$style.content__location__title">经销商</p>
      <div @click="openLocalPicker">{{agency.locationCode ? agency.locationDesc : '请选择'}}</div>
    </div>
    <p :class="$style.content__header">工作说明</p>
    <div :class="$style.content__textarea">
      <textarea v-model="agency.remark" placeholder="请填写备注信息"></textarea>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop, Watch } from 'vue-property-decorator'
  import * as WorkType from '../model/index'

  @Component
  export default class AgencyItem extends Vue {
    public agency: WorkType.Agency | null = null
    @Prop(Object) public value: WorkType.Agency
    @Prop(Function) public openLocalPicker: () => void
    @Watch('agency', { deep: true })
    public agencyChanged (val: WorkType.Agency, oldVal: WorkType.Agency) {
      this.$emit('input', val)
    }
    public setLocalAgency (): void {
      let tmpAgency: WorkType.Agency = JSON.parse(JSON.stringify(this.value))
      this.agency = tmpAgency
    }

    public created () {
      this.setLocalAgency()
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
