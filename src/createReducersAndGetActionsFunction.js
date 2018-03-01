import createActions from './createActions';
import createPrefixedActionMap from './createPrefixedActionMap';
import createReducer from './createReducer';
import { registerActions } from './connectWithActions';


const createReducersAndGetActionsFunction = (defs) => {
  const reducers = {};
  const prefixedActionMaps = {};

  Object.keys(defs).forEach(key => {
    const {actions, defaultState} = defs[key];
    prefixedActionMaps[key] = createPrefixedActionMap({
      prefix: key,
      actions
    });

    reducers[key] = createReducer({
      defaultState,
      prefixedActionMap: prefixedActionMaps[key]
    })
  });
  
  const getActions = (store) => {
    const actions = {};
    const dispatch = store.dispatch.bind(store);
    Object.keys(prefixedActionMaps).forEach(key => {
      const getState = () => store.getState()[key];
      const { asyncActions } = defs[key];
      
      //create actions
      const actionsForKey = createActions({
        dispatch,
        prefixedActionMap: prefixedActionMaps[key]
      });
      
      
      //add async actions
      Object.keys(asyncActions).forEach(asyncActionKey => {
        actionsForKey[asyncActionKey] = (...args) => {
          asyncActions[asyncActionKey]({
            actions: actionsForKey,
            getState,
            store
          }, ...args);
        }
      });
      console.log('GETTING ACTIONS FOR KEY',key, actionsForKey)
      actions[key] = actionsForKey;
    });
    registerActions(actions);
    return actions;
  }
  
  return {
    reducers,
    getActions
  }
}

export default createReducersAndGetActionsFunction;