import * as Work from './model/index'

export declare interface Workplace {
  typeDesc: string
  typeCode: string
}

export declare interface Task {
  taskId: string
  taskDesc: string
  chosen: boolean
}

export declare interface Order {
  proNum: number
  amount: number
}

export declare interface Remark {
  remark: string
}

export declare interface Location {
  locationCode: string
  locationDesc: string
}

export declare interface Plan {
  planId: string
  date: number
  planName: string
  startTime: number
  endTime: number
  finished: boolean
}

export declare interface PlanDetail extends Plan, Workplace {
  info: Work.Store | Work.Agency | Work.Office
}
