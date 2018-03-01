import produce from 'immer';

const createReducer = ({prefixedActionMap, defaultState}) => {
  const reducer = (previousState, {type, payload}) => {
    if (!previousState) { return defaultState; }
    return produce(previousState, draft => {
      const action = prefixedActionMap[type];
      action && action(draft, payload);
    });
  };
  return reducer;
};

export default createReducer;