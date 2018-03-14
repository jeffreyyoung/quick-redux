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
  key: 'counter'
};

export default counterModule;