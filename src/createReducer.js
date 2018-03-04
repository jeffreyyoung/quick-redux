import produce from 'immer';
import createActionMap from './createActionMap';
import getDefWithDefaults from './getDefWithDefaults';

const createReducer = (defIn) => {
  const def = getDefWithDefaults(defIn);
  
  const actionMap = createActionMap(def);
  const reducer = (previousState, {type, payload}) => {
    if (!previousState) { return def.defaultState; }
    return produce(previousState, draft => {
      const action = actionMap[type];
      action && action(draft, payload);
    });
  };
  return reducer;
};

export default createReducer;