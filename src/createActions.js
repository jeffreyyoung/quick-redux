import { prefixedActionMapSeparator } from './createPrefixedActionMap';

const createActions = ({prefixedActionMap, dispatch}) => {
  const actions = {};
  
  Object.keys(prefixedActionMap).forEach(prefixedActionKey => {
    actions[getKeyWithoutPrefix(prefixedActionKey, prefixedActionMapSeparator)] = (payload) => {
      dispatch({
        type: prefixedActionKey,
        payload
      });
    }
  });
  
  return actions;
}

function getKeyWithoutPrefix(prefixedKey, separator) {
  return prefixedKey.substring(
    prefixedKey.indexOf(separator) + separator.length
  );
}

export default createActions;