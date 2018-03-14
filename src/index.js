import connectWithActions from './connectWithActions';
import getActions from './getActions';
import createActionMap from './createActionMap';
import generateActionCreators from './generateActionCreators';
import createReducer from './createReducer';
import createReducers from './createReducers';
import easyConnect from './easyConnect';
const connect = connectWithActions;
const quickConnect = easyConnect;
export default {
  connectWithActions,
  getActions,
  createActionMap,
  generateActionCreators,
  createReducer,
  createReducers,
  connect,
  easyConnect,
  quickConnect
}