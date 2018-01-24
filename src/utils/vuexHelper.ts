import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'

const spreadName = (name: string): any => {
  return {
    ModuleState: namespace(name, State),
    ModuleGetter: namespace(name, Getter),
    ModuleMutation: namespace(name, Mutation),
    ModuleAction: namespace(name, Action)
  }
}

export default spreadName
