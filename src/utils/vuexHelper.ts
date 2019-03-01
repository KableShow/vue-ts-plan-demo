import {
  State,
  Getter,
  Action,
  Mutation,
  namespace
} from 'vuex-class'

const spreadName = (name: string): any => {
  let privateName = namespace(name)
  return {
    ModuleState: privateName.State,
    ModuleGetter: privateName.Getter,
    ModuleMutation: privateName.Mutation,
    ModuleAction: privateName.Action
  }
}

export default spreadName
