const counterModule = {
  defaultState: {
    count: 0
  },
  actions: {
    increment: (state, num = 1) => state.count = state.count + num,
    decrement: (state, num = 1) => state.count = state.count - num,
  },
  globalActions: {
    reset: (state) => state.count = 0
  },
  selectors: {
    isOdd: (state) => (state.count%2) === 0,
    stateWithOdd: (state, globalState, actions) => ({
      count: state.count,
      isOdd: state.count%2 === 0,
      actions
    })
  },
  key: 'counter'
};

export default counterModule;