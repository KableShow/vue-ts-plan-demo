interface State {
  country: string,
  money: number
}

const state: State = {
  country: 'Chinese',
  money: 0
}

export default {
  namespaced: true,
  state,
  getters: {
    country (state: State) { return state.country },
    money (state: State) { return state.money }
  },
  mutations: {
    setCountry (state: State, payload: string) {
      state.country = payload
    },
    setMoney (state: State, payload: number) {
      state.money = payload
    }
  }
}
