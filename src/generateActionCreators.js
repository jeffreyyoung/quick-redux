import { getKeyWithoutPrefix, prefixKey, isGlobalKey } from './createActionMap';
import getDefWithDefaults from './getDefWithDefaults';

function warnIfActionKeyExists(actionCreators, actionKey) {
  if (actionCreators[actionKey]) {
    console.warn('the following def', defIn, 'has globalActions and local actions with the same name, they should be named differently');
  }
}

const generateActionCreators = (defIn) => {
  const def = getDefWithDefaults(defIn);
  const actionCreators = {};
  Object.keys(def.actions).forEach(actionKey => {
    const prefixedKey = prefixKey(actionKey, def.key);
    actionCreators[actionKey] = (payload) => ({type: prefixedKey, payload});
  });
  
  Object.keys(def.globalActions).forEach(actionKey => {
    warnIfActionKeyExists(actionCreators, actionKey);
    actionCreators[actionKey] = (payload) => ({type: actionKey, payload})
  });
  
  //TODO figure out async actions
  // Object.keys(def.asyncActions).forEach(actionKey => {
  //   actionCreators[actionKey] => 
  // });

  return actionCreators;
}

export default generateActionCreators;