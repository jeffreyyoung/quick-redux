# quick-redux

A helper to make redux state management a little less complicated 

inpired by: https://github.com/vuejs/vuex

## Getting started

`npm install --save quick-redux`

React, redux and react-redux also must be installed to use quick-redux. If you were starting a project from scratch you could run

```
  npx create-react-app quick-redux-test
  cd quick-redux-test
  npm i --save redux react-redux quick-redux
  npm start
```

## Simple example

### 1. create a module

```javascript
const counterModule = {
  defaultState: {
    count: 0
  },
  actions: {
    increment(currentState, num = 1) => currentState.count = currentState.count + num,
    decrement(currentState, num = 1) => currentState.count = currentState.count - num,
  },
  key: 'counter'
}

export default counterModule;
```

quick-redux uses immer (https://github.com/mweststrate/immer) to modify the state.  Each action is passed the current state as it's first parameter, and then following parameters (like `num` in the above example) are what the programmer passes into the actions.

### 2. create a store
```javascript
import {createStore, combineReducers} from 'redux';
import {createReducers, getActions} from 'quick-redux';
import { Provider } from 'react-redux'
import App from './App';
import counterModule from './counterModule';

//create reducers based on our counter module
const reducers = createReducers({counter: counterModule});

const store = createStore(combineReducers(reducers));
const actions = getActions({counter}, store);

//the rest is like a regular redux app
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

### 3. access our store in a component

```javascript

import React, { Component } from 'react';
import {connect} from 'quick-redux';

//quick-redux passes an object containing all actions as a third argument to connect
const enhance = connect((state, ownProps, actions) => {
  console.log(state);
  /*
    {
      counter: {
        count: 0
      }
    }
   */
  
  console.log(actions);
  /*
    {
      counter: {
        increment(count),
        decrement(count)
      }
    }
   */
  return {
    count: state.counter.count,
    actions: actions.counter
  };
})

const CounterComponent = ({counter, actions}) => (
  <div>
    <h1>Count: {counter.count}</h1>
    <button onClick={actions.increment}>increment</button>
    <button onClick={actions.decrement}>decrement</button>
    <button onClick={() => actions.increment(10000)}>INCREMENT BY 10,000!!!111!!!1</button>
  </div>
)

export default enhance(CounterComponent);
```


