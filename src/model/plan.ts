export class Store implements Work.Remark, Work.Location {
  locationCode: string
  locationDesc: string
  taskGroup: Work.Task[]
  order: Work.Order
  remark: string
  orderCover: boolean
  constructor ({
    locationCode,
    locationDesc,
    taskGroup,
    order,
    remark,
    orderCover
  }: any) {
    let defaultOrder: Work.Order = {
      proNum: 0,
      amount: 0
    }
    this.locationCode = locationCode || ''
    this.locationDesc = locationDesc || ''
    this.taskGroup = taskGroup || []
    this.order = order || defaultOrder
    this.remark = remark || ''
    this.orderCover = orderCover || true
  }
}

export class Office implements Work.Remark, Work.Location {
  locationCode: string
  locationDesc: string
  taskGroup: Work.Task[]
  remark: string
  constructor ({
    locationCode,
    locationDesc,
    taskGroup,
    remark
  }: any) {
    this.locationCode = locationCode || ''
    this.locationDesc = locationDesc || ''
    this.taskGroup = taskGroup || []
    this.remark = remark || ''
  }
}

export class Agency implements Work.Remark, Work.Location {
  locationCode: string
  locationDesc: string
  remark: string
  constructor ({
    locationCode,
    locationDesc,
    remark
  }: any) {
    this.locationCode = locationCode || ''
    this.locationDesc = locationDesc || ''
    this.remark = remark || ''
  }
}
