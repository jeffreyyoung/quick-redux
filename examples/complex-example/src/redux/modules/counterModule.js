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
    count: (state) => state.count
  },
  key: 'counter'
};

export default counterModule;