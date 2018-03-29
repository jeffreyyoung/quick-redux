const qr = require('./..');
const assert = require('assert');

const counterModule = {
  defaultState: {
    count: 0
  },
  actions: {
    increment: (state, num) => state.count = state.count + num
  },
  globalActions: {
    decrement: (state, num) => state.count = state.count - num,
    reset: (state) => state.count = 0
  },
  selectors: {
    isZero(state, globalState) {
      return {
        isZero: state.count === 0
      };
    }
  },
  key: 'counter'
}

const listModule = {
  defaultState: {
    list: []
  },
  actions: {
    addToList: (state, toAdd) => state.list.push(toAdd)
  },
  globalActions: {
    reset: (state) => state.list = []
  },
  key: 'list'
}

describe('createReducer', function() {
    const counterReducer = qr.createReducer(counterModule);
    const state = {count: 0};

    it('local actions should not have a prefix', function() {
      const decrementedState = counterReducer(state, {type: 'decrement', payload: 2});
      assert.equal(decrementedState.count, -2);
    });
    
    it('global actions should be prefixed with module key', function() {
      const incrementedState = counterReducer(state, {type: 'counter__increment', payload: 2});
      assert.equal(incrementedState.count, 2);
    });
});

describe('generateActionCreators should create prefixed action creators', function() {
  const counterReducer = qr.createReducer(counterModule);
  const actionCreators = qr.generateActionCreators(counterModule);
  const state = {count: 0};
  
  it('actionCreators should create actions', function() {
    const decrementedState = counterReducer(state, actionCreators.decrement(2));
    assert.equal(decrementedState.count, -2);
    assert.equal(actionCreators.decrement(2).type, 'decrement');
    assert.equal(actionCreators.decrement(2).payload, 2);
  })
  
  it('actionCreators should properly create actions', function() {
    const incrementedState = counterReducer(state, actionCreators.increment(2));
    assert.equal(incrementedState.count, 2);
    assert.equal(actionCreators.increment(2).type, 'counter'+qr.createActionMap.separator+'increment');
    assert.equal(actionCreators.increment(2).payload, 2);
  })
});

describe('create store should properly create a store with all modules as reducers', function() {
  const modules = {counter: counterModule, list: listModule};
  const store = qr.createStore(modules);
  const actions = qr.getActions(modules, store);

  it('store should be created properly', function() {
    assert.equal(store.getState().counter.count, counterModule.defaultState.count);
    assert.equal(store.getState().list.list.length, listModule.defaultState.list.length);
  });

  it('actions should dispatch actions correctly', function() {
    actions.counter.increment(99);
    assert.equal(store.getState().counter.count, 99);
    
    actions.list.addToList('meow');
    assert.equal(store.getState().list.list[0], 'meow');
    assert.equal(store.getState().list.list.length, 1);
    assert.equal(store.getState().counter.count, 99);
  });
  
  it('global actions should dispatch properly', function() {
    //global actions should be called on all reducers
    actions.counter.reset();
    assert.equal(store.getState().counter.count, counterModule.defaultState.count);
    assert.equal(store.getState().list.list.length, listModule.defaultState.list.length);
  });
  
  it('actions should work', function() {
    assert.equal(typeof store.selectors.counter.isZero, 'function');
    assert.equal(store.selectors.counter.isZero(store.getState()).isZero, true);
  });
});
