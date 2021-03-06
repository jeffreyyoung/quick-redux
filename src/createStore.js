import {createStore, combineReducers} from 'redux';

import createReducers from './createReducers';
import getActions from './getActions';
import createSelectors from './createSelectors';

function getStore(modules, argsToPassToAsyncActions = {}) {
  const reducers = createReducers(modules);
  const store = createStore(combineReducers(reducers));
  //anything passed into the third argument of get actions will all be passed into asyncAction handlers on any module
  const actions = getActions(modules, store, argsToPassToAsyncActions);
  const selectors = createSelectors(modules, store);
  store.actions = actions;
  store.selectors = selectors;
  return store;
}

export default getStore;