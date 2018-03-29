import bindActionCreators from './bindActionCreators';
import generateActionCreators from './generateActionCreators';
import getDefWithDefaults from './getDefWithDefaults';
import registry from './registry';
const createSelectors = (defs) => {
  const selectors = {};
  Object.values(defs).forEach(defIn => {
    const def = getDefWithDefaults(defIn);
    const actions = registry.get('actions');
    selectors[defIn.key] = {};
    Object.entries(def.selectors).forEach(([selectorName, selectorFn]) => {
      selectors[def.key][selectorName] = (state) => {
        return selectorFn(state[def.key], state, actions);
      };
    })
  });
  registry.set('selectors', selectors);
  return selectors;
}

export default createSelectors;