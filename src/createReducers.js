import createReducer from './createReducer';

const createReducers = (defs) => {
  const reducers = {};
  Object.keys(defs).forEach(key => reducers[key] = createReducer(defs[key]));
  return reducers;
}

export default createReducers;