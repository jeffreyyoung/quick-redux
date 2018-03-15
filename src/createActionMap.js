import getDefWithDefaults from './getDefWithDefaults';

const separator = '__';

function validateKey(key, prefix) {
  if (key.indexOf(separator) !== -1) {
    throw `Invalid action key. the action ${key} for the def: ${prefix} cannot contain two consecutive underscores`
  }
}

const createActionMap = (defIn) => {
  const def = getDefWithDefaults(defIn);

  const actionMap = {};
  //local actions should be prefixed
  Object.keys(def.actions).forEach(actionKey => {
    validateKey(actionKey, def.key);
    actionMap[prefixKey(actionKey, def.key)] = def.actions[actionKey];
  });

  //globalActions should not be prefixed
  Object.keys(def.globalActions).forEach(actionKey => {
    validateKey(actionKey, def.key);
    actionMap[actionKey] = def.globalActions[actionKey];
  });

  return actionMap;
}
//checks if actions key is a global one
const isGlobalActionKey = (key) => (key.indexOf(separator) === -1);

//returns the action key without a prefix
const getActionKeyWithoutPrefix = (key) => key.substring(
    key.indexOf(separator) + separator.length
  )
  
//adds a prefix to the action key
const prefixKey = (key, prefix) => `${prefix}${separator}${key}`;
createActionMap.separator = separator;
export default createActionMap;
export {
  isGlobalKey, getKeyWithoutPrefix, prefixKey
};