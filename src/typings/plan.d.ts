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

export declare interface PlanDetail extends Plan, Workplace {
  info: Store | Agency | Office
}

export declare interface Plan {
  planId: string
  date: number
  planName: string
  startTime: number
  endTime: number
  finished: boolean
}

// declare namespace Work {
//   export interface Workplace {
//     typeDesc: string
//     typeCode: string
//   }

//   export interface Task {
//     taskId: string
//     taskDesc: string
//     chosen: boolean
//   }

//   export interface Order {
//     proNum: number
//     amount: number
//   }

//   export interface Remark {
//     remark: string
//   }

//   export interface Location {
//     locationCode: string
//     locationDesc: string
//   }

//   export interface PlanDetail extends Plan, Workplace {
//     info: Store | Agency | Office
//   }

//   export interface Plan {
//     planId: string
//     date: number
//     planName: string
//     startTime: number
//     endTime: number
//     finished: boolean
//   }
// }