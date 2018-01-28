<template>
  <div class="main">
    <div class="header-wrap">
      <div class="back-btn" @click="backRouter"></div>
      <p class="title">编辑计划</p>
    </div>
    <div class="time-wrap">
      <p class="title">时间</p>
      <div class="time-control">
        <div @click="openPicker('start', timeGroup.start)">{{ timeGroup.start || '开始' }}</div>
        <p>&nbsp;-&nbsp;</p>
        <div @click="openPicker('end', timeGroup.end)">{{ timeGroup.end || '结束' }}</div>
      </div>
    </div>
    <div class="workplace-wrap">
      <div :class="['item', {'focus': currentLocation === 'K001'}]" @click="changeTab('K001')">门店</div>
      <div :class="['item', {'focus': currentLocation === 'K002'}]" @click="changeTab('K002')">办事处</div>
      <div :class="['item', {'focus': currentLocation === 'K003'}]" @click="changeTab('K003')">经销商</div>
    </div>
    <template v-if="currentLocation === 'K001'">
      <div class="content order-content">
        <div class="location-wrap">
          <p class="title">门店</p>
          <div @click="openLocalPicker">{{store.locationCode ? store.locationDesc : '请选择'}}</div>
        </div>
        <div class="task-wrap">
          <div :class="['item', {'focus': item.chosen}]" v-for="(item, index) in store.taskGroup" @click="toggleTask(store, index)">{{item.taskDesc}}</div>
        </div>
        <p class="item-header">门店订单</p>
        <div :class="['order-wrap', {'cover': store.orderCover}]">
          <div class="item">
            <p>热销新品</p>
            <input type="number" v-model="store.order.proNum">
          </div>
          <div class="item">
            <p>销售总额</p>
            <input type="number" v-model="store.order.amount">
          </div>
        </div>
        <p class="item-header">备注</p>
        <div class="textarea">
          <textarea v-model="store.remark" placeholder="请填写备注信息"></textarea>
        </div>
      </div>
    </template>
    <template v-if="currentLocation === 'K002'">
      <div class="content">
        <div class="location-wrap">
          <p class="title">办事处</p>
          <div @click="openLocalPicker">{{office.locationCode ? office.locationDesc : '请选择'}}</div>
        </div>
        <div class="task-wrap">
          <div :class="['item', {'focus': item.chosen}]" v-for="(item, index) in office.taskGroup" @click="toggleTask(office, index)">{{item.taskDesc}}</div>
        </div>
        <p class="item-header">工作说明</p>
        <div class="textarea">
          <textarea v-model="office.remark" placeholder="请填写备注信息"></textarea>
        </div>
      </div>
    </template>
    <template v-if="currentLocation === 'K003'">
      <div class="content">
        <div class="location-wrap">
          <p class="title">经销商</p>
          <div @click="openLocalPicker">{{agency.locationCode ? agency.locationDesc : '请选择'}}</div>
        </div>
        <p class="item-header">工作说明</p>
        <div class="textarea">
          <textarea v-model="agency.remark" placeholder="请填写备注信息"></textarea>
        </div>
      </div>
    </template>
    <div class="submit-btn" @click="savePlan">保 存</div>
    <mt-datetime-picker
      ref="picker"
      type="time"
      @confirm="confirmTime"
      v-model="currentTimeModel">
    </mt-datetime-picker>
    <mt-popup
      class="localPicker"
      v-model="popupVisible"
      position="bottom">
      <mt-picker :slots="locationGroup[currentLocation]" @change="onValuesChange" value-key="locationDesc"></mt-picker>
    </mt-popup>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import * as DATA from '@/data/plan'
  import * as Plan from '@/model/plan'
  import { Toast, MessageBox } from 'mint-ui'
  import spreadName from '@/utils/vuexHelper'
  import moment from 'moment'

  const { ModuleGetter, ModuleMutation } = spreadName('plan')

  interface PickerTime {
    [index: string]: string    // 可索引的类型
    start: string
    end: string
  }

  @Component
  export default class Edit extends Vue {
    @ModuleGetter planList: Work.Plan[]
    @ModuleGetter detailList: Work.PlanDetail[]
    @ModuleMutation setPlanList: (planList: Work.Plan[]) => void
    @ModuleMutation setDetailList: (list: Work.PlanDetail[]) => void
    currentLocation: string = 'K001'
    currentTime: string = 'start'
    currentTimeModel: string = ''
    timeGroup: PickerTime = {
      start: '',
      end: ''
    }
    locationGroup: any = {
      'K001': [{
        values: DATA.LOCAR_K001,
        flex: 1,
        defaultIndex: 0
      }],
      'K002': [{
        values: DATA.LOCAR_K002,
        flex: 1,
        defaultIndex: 0
      }],
      'K003': [{
        values: DATA.LOCAR_K003,
        flex: 1,
        defaultIndex: 0
      }]
    }
    popupVisible: boolean = false
    store: Plan.Store = new Plan.Store({
      locationCode: '',
      locationDesc: '',
      taskGroup: DATA.STORETASK.map(e => {
        return Object.assign({}, e)
      }),
      order: {
        proNum: 0,
        amount: 0
      },
      remark: '',
      orderCover: true
    })

    office: Plan.Office = new Plan.Office({
      locationCode: '',
      locationDesc: '',
      taskGroup: DATA.OFFICETASK.map(e => {
        return Object.assign({}, e)
      }),
      remark: ''
    })

    agency: Plan.Agency = new Plan.Agency({
      locationCode: '',
      locationDesc: '',
      remark: ''
    })
    backRouter (): void {
      this.$router.back()
    }
    confirmTime (value: string): void {
      let currentTime: string = this.currentTime
      this.timeGroup[currentTime.toString()] = value
    }
    openPicker (tag: string, model: string): void {
      let picker: any = this.$refs.picker
      this.currentTime = tag
      this.currentTimeModel = model
      picker.open()
    }
    isDiff (): boolean {
      let locationStr: string = this.currentLocation
      let tmp: any
      switch (locationStr) {
        case 'K001':
          let storeTask: any = this.store.taskGroup.map(e => {
            let tmp: any = Object.assign({}, e)
            tmp.chosen = false
            return tmp
          })
          tmp = JSON.stringify(new Plan.Store({ taskGroup: storeTask }))
          if (tmp !== JSON.stringify(this.store)) {
            return true
          } else {
            return false
          }
        case 'K002':
          let officeTask: any = this.office.taskGroup.map(e => {
            let tmp: any = Object.assign({}, e)
            tmp.chosen = false
            return tmp
          })
          tmp = JSON.stringify(new Plan.Office({ taskGroup: officeTask }))
          if (tmp !== JSON.stringify(this.office)) {
            return true
          } else {
            return false
          }
        case 'K003':
          tmp = JSON.stringify(new Plan.Agency({}))
          if (tmp !== JSON.stringify(this.agency)) {
            return true
          } else {
            return false
          }
        default:
          break
      }
      return true
    }
    changeTab (tab: string): void {
      if (this.currentLocation !== tab) {
        if (this.isDiff()) {
          MessageBox.confirm('切换地点将清空原先数据，是否确定切换？').then(() => {
            switch (this.currentLocation) {
              case 'K001':
                let storeTask: any = this.store.taskGroup.map(e => {
                  let tmp: any = Object.assign({}, e)
                  tmp.chosen = false
                  return tmp
                })
                this.store = new Plan.Store({ taskGroup: storeTask })
                break
              case 'K002':
                let officeTask: any = this.office.taskGroup.map(e => {
                  let tmp: any = Object.assign({}, e)
                  tmp.chosen = false
                  return tmp
                })
                this.office = new Plan.Office({ taskGroup: officeTask })
                break
              case 'K003':
                this.agency = new Plan.Agency({})
                break
              default:
                break
            }
            let location: any = Object.assign({}, this.locationGroup[this.currentLocation][0])
            location.defaultIndex = 0
            this.locationGroup[this.currentLocation] = [].concat(location)
            this.currentLocation = tab
          })
        } else {
          this.currentLocation = tab
        }
      }
    }
    toggleTask (location: Plan.Store | Plan.Office, index: number) {
      let tmp = location.taskGroup[index]
      let isChosen = tmp.chosen
      tmp.chosen = !isChosen
      if (this.currentLocation === 'K001' && tmp.taskId === 'ST0001') {
        this.store.orderCover = !tmp.chosen
      }
    }
    openLocalPicker () {
      this.popupVisible = true
    }
    onValuesChange (picker: any, value: any): void {
      const tmpMap: any = {
        'K001': this.store,
        'K002': this.office,
        'K003': this.agency
      }
      let currentTab = tmpMap[this.currentLocation]
      currentTab.locationCode = value[0].locationCode
      currentTab.locationDesc = value[0].locationDesc
    }
    checkInfo (): string {
      if (!this.timeGroup.start || !this.timeGroup.end) {
        return '请完善时间信息'
      }
      let start = Number(this.timeGroup.start.toString().replace(':', '.'))
      let end = Number(this.timeGroup.end.toString().replace(':', '.'))
      if (start > end) {
        return '结束时间必需大于开始时间'
      }
      let currentTab = this.currentLocation
      switch (currentTab) {
        case 'K001':
          let store = this.store
          if (!store.locationCode) {
            return '请选择门店'
          }
          let task = store.taskGroup.filter(e => e.chosen)
          if (task.length <= 0) {
            return '请选择门店任务'
          }
          if (task.some(e => e.taskId === 'ST0001')) {
            if (store.order.amount.toString().trim() === '' || store.order.proNum.toString().trim() === '') {
              return '请完善门店订单信息'
            }
          }
          if (store.remark.trim() === '') {
            return '请填写备注信息'
          }
          break
        case 'K002':
          let office = this.office
          if (!office.locationCode) {
            return '请选择办事处'
          }
          let task2 = office.taskGroup.filter(e => e.chosen)
          if (task2.length <= 0) {
            return '请选择办事处任务'
          }
          if (office.remark.trim() === '') {
            return '请填写工作说明'
          }
          break
        case 'K003':
          let agency = this.agency
          if (!agency.locationCode) {
            return '请选择经销商'
          }
          if (agency.remark.trim() === '') {
            return '请填写工作说明'
          }
          break
      }
      return 'success'
    }
    savePlan (): void {
      let checkStatus = this.checkInfo()
      if (checkStatus !== 'success') {
        return Toast(checkStatus)
      }
      let date: number = Number(this.$route.query.date)
      let { start, end }: any = this.timeGroup
      let startArr = start.split(':')
      let startTime: number = date + startArr[0] * 60 * 60 * 1000 + startArr[1] * 60 * 1000
      let endArr = end.split(':')
      let endTime: number = date + endArr[0] * 60 * 60 * 1000 + endArr[1] * 60 * 1000
      let typeDesc: string = ''
      let planName: string = ''
      let info: Plan.Store | Plan.Office | Plan.Agency | undefined
      switch (this.currentLocation) {
        case 'K001':
          info = this.store
          typeDesc = '门店'
          planName = this.store.locationDesc
          break
        case 'K002':
          info = this.office
          typeDesc = '办事处'
          planName = this.office.locationDesc
          break
        case 'K003':
          info = this.agency
          typeDesc = '经销商'
          planName = this.agency.locationDesc
          break
        default:
          info = undefined
      }
      let plan: Work.Plan = {
        planId: this.$route.query.planId,
        date,
        planName,
        startTime,
        endTime,
        finished: false
      }
      let workPlace: Work.Workplace = {
        typeCode: this.currentLocation,
        typeDesc
      }
      let planList: Work.Plan[] = []
      planList = planList.concat(this.planList)
      planList.splice(planList.findIndex(e => e.planId === this.$route.query.planId), 1, plan)
      this.setPlanList(planList)
      let detailList: Work.PlanDetail[] = []
      detailList = detailList.concat(this.detailList)
      let index: number = detailList.findIndex(e => e.planId === this.$route.query.planId)
      let detail: Work.PlanDetail = {
        typeDesc,
        typeCode: this.currentLocation,
        info,
        ...plan
      }
      if (index < 0) {
        detailList.push(detail)
      } else {
        detailList[index] = detail
      }
      this.setDetailList(detailList)
      Toast('保存计划成功')
      this.$router.back()
    }

    created (): void {
      let detailList: Work.PlanDetail[] = []
      detailList = detailList.concat(this.detailList)
      let index: number = detailList.findIndex(e => e.planId === this.$route.query.planId)
      if (index >= 0) {
        let detail: Work.PlanDetail = detailList[index]
        this.timeGroup = {
          start: moment(detail.startTime).format('HH:mm'),
          end: moment(detail.endTime).format('HH:mm')
        }
        this.currentLocation = detail.typeCode
        switch (this.currentLocation) {
          case 'K001':
            this.store = new Plan.Store(detail.info)
            let storeLocation = this.locationGroup['K001'][0]
            let storeIndex: number = storeLocation.values.findIndex((e: any) => e.locationCode === detail.info.locationCode)
            if (storeIndex > 0) {
              storeLocation.defaultIndex = storeIndex
            }
            break
          case 'K002':
            this.office = new Plan.Office(detail.info)
            let officeLocation = this.locationGroup['K002'][0]
            let officeIndex: number = officeLocation.values.findIndex((e: any) => e.locationCode === detail.info.locationCode)
            if (officeIndex > 0) {
              officeLocation.defaultIndex = officeIndex
            }
            break
          case 'K003':
            this.agency = new Plan.Agency(detail.info)
            let agencyLocation = this.locationGroup['K003'][0]
            let agencyIndex: number = agencyLocation.values.findIndex((e: any) => e.locationCode === detail.info.locationCode)
            if (agencyIndex > 0) {
              agencyLocation.defaultIndex = agencyIndex
            }
            break
          default:
            break
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @blue: #39f;
  
  .main {
    font-size: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .header-wrap {
    display: flex;
    height: 40px;
    background-color: @blue;
    color: #fff;
    .back-btn {
      width: 18px;
      height: 100%;
      margin: 0 10px;
      background: url('~@/assets/common/leftArrow@2x.png') no-repeat left center;
      background-size: 11.5px 20px;
    }
    .title { flex: 1; line-height: 40px; }
  }
  .time-wrap {
    display: flex;
    position: relative;
    justify-content: space-between;
    padding: 0 22px 0 10px;
    line-height: 40px;
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
      background: url('~@/assets/common/rightArrow.png') no-repeat left center;
      background-size: 8px 12px;
    }
    .title { color: #333; }
    .time-control { display: flex; }
  }
  .workplace-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
    color: #666;
    .item {
      margin-top: 10px;
      margin-left: 10px;
      padding: 5px 12px;
      border: 1px solid #d7d7d7;
      border-radius: 4px;
      &.focus {
        border-color: #ff6c47;
        color: #ff6c47;
      }
    }
  }
  .content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    color: #666;
    .location-wrap {
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
        background: url('~@/assets/common/rightArrow.png') no-repeat left center;
        background-size: 8px 12px;
      }
      .title { color: #333; }
    }
    .task-wrap {
      padding-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      background-color: #fff;
      color: #666;
      .item {
        margin-top: 10px;
        margin-left: 10px;
        padding: 5px 12px;
        border: 1px solid #d7d7d7;
        border-radius: 4px;
        &.focus {
          border-color: #ff6c47;
          color: #ff6c47;
        }
      }
    }
    .item-header {
      line-height: 40px;
      margin-top: 10px;
      padding-left: 10px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      color: #333;
    }
    .textarea {
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
  .order-content {
    .order-wrap {
      position: relative;
      padding: 15px 10px;
      background-color: #fff;
      .item {
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
      &.cover:after {
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
  .submit-btn {
    line-height: 40px;
    background-color: #ff6c47;
    text-align: center;
    font-size: 15px;
    color: #fff;
  }
  .localPicker {
    width: 100%;
  }
</style>
