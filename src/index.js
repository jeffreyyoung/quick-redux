import connectWithActions from './connectWithActions';
import getActions from './getActions';
import createActionMap from './createActionMap';
import generateActionCreators from './generateActionCreators';
import createReducer from './createReducer';
import createReducers from './createReducers';
import easyConnect from './easyConnect';
const connect = connectWithActions;
const quickConnect = easyConnect;
import createStore from './createStore';
import inject from './inject';
export default {
  connectWithActions,
  getActions,
  inject,
  createActionMap,
  generateActionCreators,
  createReducer,
  createReducers,
  connect,
  easyConnect,
  quickConnect,
  createStore
}