const getDefWithDefaults = (def) => ({
    defaultState: {},
    actions: [],
    globalActions: [],
    key: '',
    ...def
  });

export default getDefWithDefaults;