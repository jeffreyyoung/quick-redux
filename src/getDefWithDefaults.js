const getDefWithDefaults = (def) => ({
    defaultState: {},
    actions: [],
    globalActions: [],
    asyncActions: [],
    key: '',
    ...def
  });

export default getDefWithDefaults;