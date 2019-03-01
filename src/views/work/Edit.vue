<template>
  <div class="main">
    <div class="header">
      <div class="header__backBtn" @click="backRouter"></div>
      <p class="header__title">编辑计划</p>
    </div>
    <div class="time">
      <p class="time__title">时间</p>
      <div class="time__control">
        <div @click="openPicker('start', timeGroup.start)">{{ timeGroup.start || '开始' }}</div>
        <p>&nbsp;-&nbsp;</p>
        <div @click="openPicker('end', timeGroup.end)">{{ timeGroup.end || '结束' }}</div>
      </div>
    </div>
    <div class="workplace">
      <div :class="['workplace__item', {'workplace__item--focus': currentLocation === 'K001'}]" @click="changeTab('K001')">门店</div>
      <div :class="['workplace__item', {'workplace__item--focus': currentLocation === 'K002'}]" @click="changeTab('K002')">办事处</div>
      <div :class="['workplace__item', {'workplace__item--focus': currentLocation === 'K003'}]" @click="changeTab('K003')">经销商</div>
    </div>
    <store-item v-if="currentLocation === 'K001'" v-model="store" :toggleTask="toggleTask" :openLocalPicker="openLocalPicker"></store-item>
    <office-item v-if="currentLocation === 'K002'" v-model="office" :toggleTask="toggleTask" :openLocalPicker="openLocalPicker"></office-item>
    <agency-item v-if="currentLocation === 'K003'" v-model="agency" :openLocalPicker="openLocalPicker"></agency-item>
    <div class="submit" @click="savePlan">保 存</div>
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
  import * as WorkType from './model/index'
  import spreadName from '@/utils/vuexHelper'
  import moment from 'moment'
  import * as Work from './declare'
  import StoreItem from './components/StoreItem.vue'
  import OfficeItem from './components/OfficeItem.vue'
  import AgencyItem from './components/AgencyItem.vue'

  const { ModuleGetter, ModuleMutation } = spreadName('work')

  interface PickerTime {
    [index: string]: string    // 可索引的类型
    start: string
    end: string
  }

  @Component({
    components: {
      'store-item': StoreItem,
      'office-item': OfficeItem,
      'agency-item': AgencyItem
    }
  })
  export default class Edit extends Vue {
    @ModuleGetter public planList: Work.Plan[]
    @ModuleGetter public detailList: Work.PlanDetail[]
    @ModuleMutation public setPlanList: (planList: Work.Plan[]) => void
    @ModuleMutation public setDetailList: (list: Work.PlanDetail[]) => void
    public currentLocation: string = 'K001'
    public currentTime: string = 'start'
    public currentTimeModel: string = ''
    public timeGroup: PickerTime = {
      start: '',
      end: ''
    }
    public locationGroup: any = {
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
    public popupVisible: boolean = false // 是否显示遮罩
    public store: WorkType.Store = new WorkType.Store({
      locationCode: '',
      locationDesc: '',
      taskGroup: DATA.STORETASK.map((e: any) => {
        return Object.assign({}, e)
      }),
      order: {
        proNum: 0,
        amount: 0
      },
      remark: '',
      orderCover: true
    })

    public office: WorkType.Office = new WorkType.Office({
      locationCode: '',
      locationDesc: '',
      taskGroup: DATA.OFFICETASK.map((e: any) => {
        return Object.assign({}, e)
      }),
      remark: ''
    })

    public agency: WorkType.Agency = new WorkType.Agency({
      locationCode: '',
      locationDesc: '',
      remark: ''
    })
    public backRouter (): void {
      this.$router.back()
    }
    public confirmTime (value: string): void {
      let currentTime: string = this.currentTime
      this.timeGroup[currentTime.toString()] = value
    }
    public openPicker (tag: string, model: string): void {
      let picker: any = this.$refs.picker
      this.currentTime = tag
      this.currentTimeModel = model
      picker.open()
    }
    public isDiff (): boolean {
      let locationStr: string = this.currentLocation
      let tmp: any
      switch (locationStr) {
        case 'K001':
          let storeTask: any = this.store.taskGroup.map((e: any) => {
            let tmp: any = Object.assign({}, e)
            tmp.chosen = false
            return tmp
          })
          tmp = JSON.stringify(new WorkType.Store({ taskGroup: storeTask }))
          if (tmp !== JSON.stringify(this.store)) {
            return true
          } else {
            return false
          }
        case 'K002':
          let officeTask: any = this.office.taskGroup.map((e: any) => {
            let tmp: any = Object.assign({}, e)
            tmp.chosen = false
            return tmp
          })
          tmp = JSON.stringify(new WorkType.Office({ taskGroup: officeTask }))
          if (tmp !== JSON.stringify(this.office)) {
            return true
          } else {
            return false
          }
        case 'K003':
          tmp = JSON.stringify(new WorkType.Agency({}))
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
    public async changeTab (tab: string): Promise<void> {
      if (this.currentLocation !== tab) {
        if (this.isDiff()) {
          await this.$messagebox.confirm('切换地点将清空原先数据，是否确定切换？')
          switch (this.currentLocation) {
            case 'K001':
              let storeTask: any = this.store.taskGroup.map((e: any) => {
                let tmp: any = Object.assign({}, e)
                tmp.chosen = false
                return tmp
              })
              this.store = new WorkType.Store({ taskGroup: storeTask })
              break
            case 'K002':
              let officeTask: any = this.office.taskGroup.map((e: any) => {
                let tmp: any = Object.assign({}, e)
                tmp.chosen = false
                return tmp
              })
              this.office = new WorkType.Office({ taskGroup: officeTask })
              break
            case 'K003':
              this.agency = new WorkType.Agency({})
              break
            default:
              break
          }
          let location: any = Object.assign({}, this.locationGroup[this.currentLocation][0])
          location.defaultIndex = 0
          this.locationGroup[this.currentLocation] = [].concat(location)
          this.currentLocation = tab
        } else {
          this.currentLocation = tab
        }
      }
    }
    public toggleTask (location: WorkType.Store | WorkType.Office, index: number) {
      let tmp = location.taskGroup[index]
      let isChosen = tmp.chosen
      tmp.chosen = !isChosen
      if (this.currentLocation === 'K001' && tmp.taskId === 'ST0001') {
        this.store.orderCover = !tmp.chosen
      }
    }
    public openLocalPicker () {
      this.popupVisible = true
    }
    public onValuesChange (picker: any, value: any): void {
      const tmpMap: any = {
        'K001': this.store,
        'K002': this.office,
        'K003': this.agency
      }
      let currentTab = tmpMap[this.currentLocation]
      currentTab.locationCode = value[0].locationCode
      currentTab.locationDesc = value[0].locationDesc
    }
    public checkInfo (): string {
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
          let task = store.taskGroup.filter((e: any) => e.chosen)
          if (task.length <= 0) {
            return '请选择门店任务'
          }
          if (task.some((e: any) => e.taskId === 'ST0001')) {
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
          let task2 = office.taskGroup.filter((e: any) => e.chosen)
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
    public savePlan (): void {
      let checkStatus = this.checkInfo()
      if (checkStatus !== 'success') {
        return this.$toast(checkStatus)
      }
      let date: number = Number(this.$route.query.date)
      let { start, end }: any = this.timeGroup
      let startArr = start.split(':')
      let startTime: number = date + startArr[0] * 60 * 60 * 1000 + startArr[1] * 60 * 1000
      let endArr = end.split(':')
      let endTime: number = date + endArr[0] * 60 * 60 * 1000 + endArr[1] * 60 * 1000
      let typeDesc: string = ''
      let planName: string = ''
      let info: WorkType.Store | WorkType.Office | WorkType.Agency | undefined
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
      if (info === undefined) {
        this.$toast('选择门店错误')
        throw new Error('wrong store type!')
      }
      let plan: Work.Plan = {
        planId: this.$route.query.planId.toString(),
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
      planList.splice(planList.findIndex((e: any) => e.planId === this.$route.query.planId), 1, plan)
      this.setPlanList(planList)
      let detailList: Work.PlanDetail[] = []
      detailList = detailList.concat(this.detailList)
      let index: number = detailList.findIndex((e: any) => e.planId === this.$route.query.planId)
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
      this.$toast('保存计划成功')
      this.$router.back()
    }

    public created (): void {
      let detailList: Work.PlanDetail[] = []
      detailList = detailList.concat(this.detailList)
      let index: number = detailList.findIndex((e: any) => e.planId === this.$route.query.planId)
      if (index >= 0) {
        let detail: Work.PlanDetail = detailList[index]
        this.timeGroup = {
          start: moment(detail.startTime).format('HH:mm'),
          end: moment(detail.endTime).format('HH:mm')
        }
        this.currentLocation = detail.typeCode
        switch (this.currentLocation) {
          case 'K001':
            this.store = new WorkType.Store(detail.info)
            let storeLocation = this.locationGroup['K001'][0]
            let storeValues: any[] = storeLocation.values
            let storeIndex: number = storeValues.findIndex((e: any) => e.locationCode === detail.info.locationCode)
            if (storeIndex > 0) {
              storeLocation.defaultIndex = storeIndex
            }
            break
          case 'K002':
            this.office = new WorkType.Office(detail.info)
            let officeLocation = this.locationGroup['K002'][0]
            let officeValues: any[] = officeLocation.values
            let officeIndex: number = officeValues.findIndex((e: any) => e.locationCode === detail.info.locationCode)
            if (officeIndex > 0) {
              officeLocation.defaultIndex = officeIndex
            }
            break
          case 'K003':
            this.agency = new WorkType.Agency(detail.info)
            let agencyLocation = this.locationGroup['K003'][0]
            let agencyValues: any[] = agencyLocation.values
            let agencyIndex: number = agencyValues.findIndex((e: any) => e.locationCode === detail.info.locationCode)
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
  .header {
    display: flex;
    height: 40px;
    background-color: @blue;
    color: #fff;
    &__backBtn {
      width: 18px;
      height: 100%;
      margin: 0 10px;
      background: url('~@/assets/common/leftArrow@2x.png') no-repeat left center;
      background-size: 11.5px 20px;
    }
    &__title { flex: 1; line-height: 40px; }
  }
  .time {
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
    &__title { color: #333; }
    &__control { display: flex; }
  }
  .workplace {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    font-size: 14px;
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
  .submit {
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
