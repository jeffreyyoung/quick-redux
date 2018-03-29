const getDefWithDefaults = (def) => ({
    defaultState: {},
    actions: {},
    globalActions: {},
    asyncActions: {},
    selectors: {},
    key: '',
    ...def
  });

export default getDefWithDefaults;