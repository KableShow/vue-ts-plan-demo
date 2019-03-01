<template>
  <div class="main">
    <div class="header">
      <p class="header__title">工作计划</p>
      <!-- 状态头部 -->
      <div class="header__status">
        <ul class="header__statusInner" ref="statusList">
          <li :class="['header__statusItem', currentStatus === 'future' && 'header__statusItem--focus']" @click="changeStatus('future', 0)">未来计划</li>
          <li :class="['header__statusItem', currentStatus === 'past' && 'header__statusItem--focus']" @click="changeStatus('past', 1)">过往计划</li>
          <li :class="['header__statusItem', currentStatus === 'unfinished' && 'header__statusItem--focus']" @click="changeStatus('unfinished', 2)">未完成</li>
          <div class="header__statusInner__bg" ref="bgRef"></div>
        </ul>
      </div>
    </div>
    <!-- 计划列表 -->
    <ul class="content">
      <index-item v-for="(item, index) in planList" :key="'plan' + index" :openComponent="openEdit" :item="item"></index-item>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import spreadName from '@/utils/vuexHelper'
  import moment from 'moment'
  import * as Work from './declare'
  import IndexItem from './components/IndexItem.vue'

  const { ModuleGetter, ModuleMutation } = spreadName('work')

  @Component({
    components: {
      'index-item': IndexItem
    }
  })
  export default class List extends Vue {
    @ModuleGetter public planList: Work.Plan[]
    @ModuleGetter public currentStatus: string
    @ModuleGetter public currentIndex: number
    @ModuleMutation public setPlanList: (planList: Work.Plan[]) => void
    @ModuleMutation public setCurrentStatus: (status: string) => void
    @ModuleMutation public setCurrentIndex: (index: number) => void
    public statusLen: number = 0

    public changeStatus (status: string, index: number): void {
      this.setCurrentStatus(status)
      this.setCurrentIndex(index)
      let bgRef: any = this.$refs.bgRef
      bgRef.style.left = (100 / this.statusLen) * index + '%'
    }
    public openEdit (date: number, planId: string): void {
      let params: any = {
        path: '/work/edit',
        query: {
          date,
          planId
        }
      }
      this.$router.push(params)
    }
    // 初始化计划列表数据
    public initPlanList (initDay: number = 7): void {
      let createPlan = (day: number): Work.Plan[] => {
        let now: Date = new Date()
        let time: number = (new Date(now.getFullYear(), now.getMonth(), now.getDate())).getTime()
        let oneDay: number = 1000 * 60 * 60 * 24
        let dayArr: Work.Plan[] = Array.from({ length: day }).map((e, i) => {
          let planDate: number = oneDay * i + time
          let plan: Work.Plan = {
            planId: 'JK' + moment(planDate).format('YYYYMMDD'),
            date: planDate,
            planName: '',
            startTime: 0,
            endTime: 0,
            finished: false
          }
          return plan
        })
        return dayArr
      }
      if (this.planList.length <= 0) {
        let planList: Work.Plan[] = createPlan(initDay)
        this.setPlanList(planList)
      }
    }

    public created (): void {
      this.initPlanList()
    }

    public mounted (): void {
      let statusRef: any = this.$refs.statusList
      this.statusLen = statusRef.children.length - 1
      let bgRef: any = this.$refs.bgRef
      bgRef.style.width = 100 / this.statusLen + '%'
      bgRef.style.left = (100 / this.statusLen) * this.currentIndex + '%'
    }
  }

</script>

<style lang="less" scoped>
  @blue: #39f;
  @white: #fff;
  
  .main {
    font-size: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header {
    flex: none;
    text-align: center;
    color: @white;
    &__title { background-color: @blue; line-height: 40px; }
    &__status {
      position: relative;
      margin: 10px;
      font-size: 13px;
    }
    &__statusInner {
      display: flex;
      position: relative;
      border: 1px solid @blue;
      border-radius: 50px;
      color: @blue;
      &__bg {
        position: absolute;
        z-index: -1;
        top: 0px;
        left: 0px;
        display: block;
        height: 25px;
        background-color: @blue;
        border-radius: 27px;
        transition: left .3s;
      }
    }
    &__statusItem {
      flex: 1;
      flex-shrink: 0;
      line-height: 25px;
      border-radius: 25px;
      &--focus { color: @white; }
    }
  }
  .content {
    flex: auto;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>