import {createStore} from 'quick-redux';

import api from './api';

import counterModule from './modules/counterModule';
import todoListModule from './modules/todoListModule';

const modules = {
  counter: counterModule,
  todoList: todoListModule
};

function getStore() {
  console.log('create store');
  return createStore(modules, {api});
}

export default getStore;