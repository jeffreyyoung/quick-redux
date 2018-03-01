const separator = '__';

const createPrefixedActionMap = ({actions, prefix}) => {
  const prefixedActionMap = {};
  Object.keys(actions).forEach(actionKey => {
    prefixedActionMap[`${prefix}${separator}${actionKey}`] = actions[actionKey];
  });
  return prefixedActionMap;
}

export default createPrefixedActionMap;

export {
  separator as prefixedActionMapSeparator
};