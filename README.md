[![Build Status](https://travis-ci.org/jeffreyyoung/quick-redux.svg?branch=master)](https://travis-ci.org/jeffreyyoung/quick-redux)

![Quick Redux](https://raw.githubusercontent.com/jeffreyyoung/quick-redux/master/examples/icon.png "quick redux")

# quick-redux

A helper to make redux state management a little less complicated. Rather than dealing with actionCreators, dispatch, and reducers, you create modules to handle state.

inpired by: 
* [Vuex](http://vuex.vuejs.org/en/intro.html)
* [immer](https://github.com/mweststrate/immer)

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
    increment: (state, num = 1) => state.count = state.count + num,
    decrement: (state, num = 1) => state.count = state.count - num,
  },
  key: 'counter'
}

export default counterModule;
```

quick-redux uses [immer](https://github.com/mweststrate/immer) to handle state modifications.  it doesn't matter what an action returns, just modify the current state and immer will create the next immutable state

### 2. create a store from our modules

`createStore` takes our modules as arguments and returns 

```javascript
import ReactDOM from 'react-dom';
import {createStore} from 'quick-redux';
import { Provider } from 'react-redux'

//create a store
const store = createStore({
  counter: counterModule
});

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

//quick-redux connect passes an object containing all actions as a third argument to connect
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

const CounterComponent = ({count, actions}) => (
  <div>
    <h1>Count: {count}</h1>
    <button onClick={() => actions.increment()}>increment</button>
    <button onClick={() => actions.decrement()}>decrement</button>
    <button onClick={() => actions.increment(10000)}>INCREMENT BY 10,000!!!111!!!1</button>
  </div>
)

export default enhance(CounterComponent);
```


## more complex example
this shows how to generate reducers using `createReducers` and action creators using `getActions` from our modules so that any redux middleware can be used with our store
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, combineReducers} from 'redux';
import {createReducers, getActions} from 'quick-redux';
import { Provider } from 'react-redux'

const todoModule = {
  defaultState: {
    todos: [],
    loading: false
  },
  actions: { //the action creators of these actions are prefixed with the module key, so they are scoped to the todoModule
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    removeTodo(state, index) {
      state.todos = state.todos.splice(index, 1);
    },
    setLoading(state, loading) {
      state.loading = loading;
    }
  },
  globalActions: { //these actions are not prefixed, so if you call reset on any module, this action handler will be run
    reset(state) {
      state.todos = [];
      state.loading = false;
    }
  },
  asyncActions: {
    async loadTodos({actions, api}) {
      const todos = await api.loadTodos();
      todos.forEach(todo => actions.addTodo(todo));
    }
  },
  key: 'todoList'
};

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

const modules = {
  counter: counterModule,
  todoList: todoModule
}

const api = {
  loadTodos() {
    return new Promise((resolve) => {
      resolve([{id:1, text: 'finish something'}])
    });
  }
}

const reducers = createReducers(modules);
const store = createStore(combineReducers(reducers));

//anything passed into the third argument of get actions will all be passed into asyncAction handlers on any module
const actions = getActions(modules, store, {api});

async function run() {
  await actions.todos.loadTodos();
  actions.counter.increment(1000);
  console.log(store.getState());
  /*
    {
      counter: {
        count: 1000
      },
      todoList: {
        loading: false,
        todos: [{...}]
      }
    }
   */
  actions.todoList.reset();
  console.log(store.getState());
  /*
    {
      counter: {
        count: 0
      },
      todoList: {
        loading: false,
        todos: []
      }
    }
   */
}
run();

```


