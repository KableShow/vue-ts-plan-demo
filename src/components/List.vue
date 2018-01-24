<template>
  <div class="main">
    <div class="header-wrap">
      <p class="title">工作计划</p>
      <div class="status-wrap">
        <ul ref="statusList">
          <li :class="{'focus': currentStatus === 'future'}" @click="changeStatus('future', 0)">未来计划</li>
          <li :class="{'focus': currentStatus === 'past'}" @click="changeStatus('past', 1)">过往计划</li>
          <li :class="{'focus': currentStatus === 'unfinished'}" @click="changeStatus('unfinished', 2)">未完成</li>
          <div class="bg-wrap" ref="bgRef"></div>
        </ul>
      </div>
    </div>
    <ul class="content-wrap">
      <li v-for="item in planList" class="item" @click="openComponent(item.date, item.planId)">
        <div class="time-wrap">
          <p>{{item.date | formatTime('MM/DD')}}</p>
          <p>{{item.date | formatTime('星期dd')}}</p>
        </div>
        <div v-if="item.planName" class="info-wrap">
          <p>计划：{{item.planName}}</p>
          <p>时间：{{item.startTime | formatTime('HH:mm')}} - {{item.endTime | formatTime('HH:mm')}}</p>         
        </div>
        <div v-else class="info-wrap no-plan">
          <p>未制定计划</p>
        </div>
        <div class="arrow"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Model, Prop, Watch } from 'vue-property-decorator'
  import spreadName from '@/utils/vuexHelper'
  import moment from 'moment'

  const { ModuleGetter, ModuleMutation } = spreadName('plan')

  @Component({
    filters: {
      formatTime (value: any, format: string) {
        return moment(value).format(format)
      }
    }
  })
  export default class List extends Vue {
    @ModuleGetter planList: Work.Plan[]
    @ModuleGetter currentStatus: string
    @ModuleGetter currentIndex: number
    @ModuleMutation setPlanList: (planList: Work.Plan[]) => void
    @ModuleMutation setCurrentStatus: (status: string) => void
    @ModuleMutation setCurrentIndex: (index: number) => void
    statusLen: number = 0

    changeStatus (status: string, index: number): void {
      this.setCurrentStatus(status)
      this.setCurrentIndex(index)
      let bgRef: any = this.$refs.bgRef
      bgRef.style.left = (100 / this.statusLen) * index + '%'
    }
    openComponent (date: number, planId: string): void {
      let params: any = {
        path: '/edit',
        query: {
          date,
          planId
        }
      }
      this.$router.push(params)
    }

    created (): void {
      let createPlan = (day: number = 7): Work.Plan[] => {
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
        let planList: Work.Plan[] = createPlan(7)
        this.setPlanList(planList)
      }
    }

    mounted (): void {
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
  .header-wrap {
    flex: none;
    text-align: center;
    color: @white;
    .title { background-color: @blue; line-height: 40px; }
    .status-wrap {
      position: relative;
      margin: 10px;
      font-size: 13px;
      ul {
        display: flex;
        position: relative;
        border: 1px solid @blue;
        border-radius: 50px;
        color: @blue;
        .bg-wrap {
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
        li {
          flex: 1;
          flex-shrink: 0;
          line-height: 25px;
          border-radius: 25px;
          &.focus { color: @white; }
        }
      }
    }
  }
  .content-wrap {
    flex: auto;
    overflow-x: hidden;
    overflow-y: scroll;
    .item {
      display: flex;
      height: 90px;
      padding: 10px;
      &:nth-child(odd) { background-color: #fff; }
      .arrow {
        flex-shrink: 0;
        width: 18px;
        height: 100%;
        background: url('~@/assets/common/rightArrow.png') no-repeat right center;
        background-size: 8px 12px;
      }
      .time-wrap {
        flex-shrink: 0;
        width: 50px;
        margin-top: 15px;
        margin-right: 10px;
        text-align: center;
        color: @blue;
      }
      .info-wrap {
        display: flex;
        flex: 1;
        min-width:0;
        min-height:0;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 10px;
        border-left: 1px solid #aaa;
        p {
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        &.no-plan { color: #ccc; line-height: 70px; }
      }
    }
  }
</style>
