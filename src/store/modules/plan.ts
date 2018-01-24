interface State {
  planList: Work.Plan[]
  currentStatus: string
  currentIndex: number
  detailList: Work.PlanDetail[]
}

const state: State = {
  planList: [],
  currentStatus: 'future',
  currentIndex: 0,
  detailList: []
}

const getters = {
  planList (state: State) { return state.planList },
  currentStatus (state: State) { return state.currentStatus },
  currentIndex (state: State) { return state.currentIndex },
  detailList (state: State) { return state.detailList }
}

const mutations = {
  setPlanList (state: State, payload: Work.Plan[]) {
    state.planList = payload
  },
  setCurrentStatus (state: State, payload: string) {
    state.currentStatus = payload
  },
  setCurrentIndex (state: State, payload: number) {
    state.currentIndex = payload
  },
  setDetailList (state: State, payload: Work.PlanDetail[]) {
    state.detailList = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
