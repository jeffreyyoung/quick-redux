import getDefWithDefaults from './getDefWithDefaults';

const bindActionCreators = ({actionCreators, dispatch, store, def, key, ...additionalArgs}) => {
  const defWithDefaults = getDefWithDefaults(def);
  
  const actions = {};
  Object.keys(actionCreators).forEach(key => {
    const createAction = actionCreators[key];
    actions[key] = (payload) => dispatch(createAction(payload));
  });
  
  Object.keys(defWithDefaults.asyncActions).forEach(asyncActionKey => {
    actions[asyncActionKey] = (...args) => defWithDefaults.asyncActions[asyncActionKey](
      {actions, getState: () => store.getState()[key], store, dispatch, ...additionalArgs},
      ...args
    );
  })
  return actions;
}

export default bindActionCreators;