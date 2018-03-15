'use strict';

var reactRedux = require('react-redux');
var redux = require('redux');

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var actions = {};

function registerActions(actionsIn) {
  actions = actionsIn;
}

function easyConnect() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var nextArgs = [].concat(args);
  nextArgs[0] = function () {
    for (var _len2 = arguments.length, mapStateToPropsArguments = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      mapStateToPropsArguments[_key2] = arguments[_key2];
    }

    return args[0].apply(args, mapStateToPropsArguments.concat([actions]));
  };
  return reactRedux.connect.apply(undefined, toConsumableArray(nextArgs));
}

var getDefWithDefaults = function getDefWithDefaults(def) {
    return _extends({
        defaultState: {},
        actions: [],
        globalActions: [],
        asyncActions: [],
        key: ''
    }, def);
};

var bindActionCreators = function bindActionCreators(_ref) {
  var actionCreators = _ref.actionCreators,
      dispatch = _ref.dispatch,
      store = _ref.store,
      def = _ref.def,
      key = _ref.key,
      additionalArgs = objectWithoutProperties(_ref, ['actionCreators', 'dispatch', 'store', 'def', 'key']);

  var defWithDefaults = getDefWithDefaults(def);

  var actions = {};
  Object.keys(actionCreators).forEach(function (key) {
    var createAction = actionCreators[key];
    actions[key] = function (payload) {
      return dispatch(createAction(payload));
    };
  });

  Object.keys(defWithDefaults.asyncActions).forEach(function (asyncActionKey) {
    actions[asyncActionKey] = function () {
      var _defWithDefaults$asyn;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_defWithDefaults$asyn = defWithDefaults.asyncActions)[asyncActionKey].apply(_defWithDefaults$asyn, [_extends({ actions: actions, getState: function getState() {
          return store.getState()[key];
        }, store: store, dispatch: dispatch }, additionalArgs)].concat(args));
    };
  });
  return actions;
};

var separator = '__';

function validateKey(key, prefix) {
  if (key.indexOf(separator) !== -1) {
    throw 'Invalid action key. the action ' + key + ' for the def: ' + prefix + ' cannot contain two consecutive underscores';
  }
}

var createActionMap = function createActionMap(defIn) {
  var def = getDefWithDefaults(defIn);

  var actionMap = {};
  //local actions should be prefixed
  Object.keys(def.actions).forEach(function (actionKey) {
    validateKey(actionKey, def.key);
    actionMap[prefixKey(actionKey, def.key)] = def.actions[actionKey];
  });

  //globalActions should not be prefixed
  Object.keys(def.globalActions).forEach(function (actionKey) {
    validateKey(actionKey, def.key);
    actionMap[actionKey] = def.globalActions[actionKey];
  });

  return actionMap;
};

//adds a prefix to the action key
var prefixKey = function prefixKey(key, prefix) {
  return '' + prefix + separator + key;
};
createActionMap.separator = separator;

function warnIfActionKeyExists(actionCreators, actionKey) {
  if (actionCreators[actionKey]) {
    console.warn('the following def', defIn, 'has globalActions and local actions with the same name, they should be named differently');
  }
}

var generateActionCreators = function generateActionCreators(defIn) {
  var def = getDefWithDefaults(defIn);
  var actionCreators = {};
  Object.keys(def.actions).forEach(function (actionKey) {
    var prefixedKey = prefixKey(actionKey, def.key);
    actionCreators[actionKey] = function (payload) {
      return { type: prefixedKey, payload: payload };
    };
  });

  Object.keys(def.globalActions).forEach(function (actionKey) {
    warnIfActionKeyExists(actionCreators, actionKey);
    actionCreators[actionKey] = function (payload) {
      return { type: actionKey, payload: payload };
    };
  });

  //TODO figure out async actions
  // Object.keys(def.asyncActions).forEach(actionKey => {
  //   actionCreators[actionKey] => 
  // });

  return actionCreators;
};

var getActions = function getActions(defs, store) {
  var additionalParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var actions = {};

  Object.keys(defs).forEach(function (key) {
    var def = defs[key];
    actions[key] = bindActionCreators(_extends({
      actionCreators: generateActionCreators(def),
      def: def,
      dispatch: store.dispatch,
      store: store,
      key: key
    }, additionalParams));
  });

  registerActions(actions);
  return actions;
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var PROXY_STATE = typeof Symbol !== "undefined" ? Symbol("immer-proxy-state") : "__$immer_state";

var RETURNED_AND_MODIFIED_ERROR = "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.";

function verifyMinified() {}

var inProduction = typeof process !== "undefined" && process.env.NODE_ENV === "production" || verifyMinified.name !== "verifyMinified";

var autoFreeze = !inProduction;
var useProxies = typeof Proxy !== "undefined";

function getUseProxies() {
    return useProxies;
}

function isProxy(value) {
    return !!value && !!value[PROXY_STATE];
}

function isProxyable(value) {
    if (!value) return false;
    if ((typeof value === "undefined" ? "undefined" : _typeof$1(value)) !== "object") return false;
    if (Array.isArray(value)) return true;
    var proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
}

function freeze(value) {
    if (autoFreeze) {
        Object.freeze(value);
    }
    return value;
}

function shallowCopy(value) {
    if (Array.isArray(value)) return value.slice();
    if (value.__proto__ === undefined) return Object.assign(Object.create(null), value);
    return Object.assign({}, value);
}

function each(value, cb) {
    if (Array.isArray(value)) {
        for (var i = 0; i < value.length; i++) {
            cb(i, value[i]);
        }
    } else {
        for (var key in value) {
            cb(key, value[key]);
        }
    }
}

function has(thing, prop) {
    return Object.prototype.hasOwnProperty.call(thing, prop);
}

// given a base object, returns it if unmodified, or return the changed cloned if modified
function finalize(base) {
    if (isProxy(base)) {
        var state = base[PROXY_STATE];
        if (state.modified === true) {
            if (state.finalized === true) return state.copy;
            state.finalized = true;
            return finalizeObject(useProxies ? state.copy : state.copy = shallowCopy(base), state);
        } else {
            return state.base;
        }
    }
    finalizeNonProxiedObject(base);
    return base;
}

function finalizeObject(copy, state) {
    var base = state.base;
    each(copy, function (prop, value) {
        if (value !== base[prop]) copy[prop] = finalize(value);
    });
    return freeze(copy);
}

function finalizeNonProxiedObject(parent) {
    // If finalize is called on an object that was not a proxy, it means that it is an object that was not there in the original
    // tree and it could contain proxies at arbitrarily places. Let's find and finalize them as well
    if (!isProxyable(parent)) return;
    if (Object.isFrozen(parent)) return;
    each(parent, function (i, child) {
        if (isProxy(child)) {
            parent[i] = finalize(child);
        } else finalizeNonProxiedObject(child);
    });
    // always freeze completely new data
    freeze(parent);
}



function is(x, y) {
    // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}

// @ts-check

var proxies = null;

var objectTraps = {
    get: get$1,
    has: function has$$1(target, prop) {
        return prop in source(target);
    },
    ownKeys: function ownKeys(target) {
        return Reflect.ownKeys(source(target));
    },

    set: set$1,
    deleteProperty: deleteProperty,
    getOwnPropertyDescriptor: getOwnPropertyDescriptor,
    defineProperty: defineProperty$1,
    setPrototypeOf: function setPrototypeOf() {
        throw new Error("Don't even try this...");
    }
};

var arrayTraps = {};
each(objectTraps, function (key, fn) {
    arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
    };
});

function createState(parent, base) {
    return {
        modified: false,
        finalized: false,
        parent: parent,
        base: base,
        copy: undefined,
        proxies: {}
    };
}

function source(state) {
    return state.modified === true ? state.copy : state.base;
}

function get$1(state, prop) {
    if (prop === PROXY_STATE) return state;
    if (state.modified) {
        var value = state.copy[prop];
        if (value === state.base[prop] && isProxyable(value))
            // only create proxy if it is not yet a proxy, and not a new object
            // (new objects don't need proxying, they will be processed in finalize anyway)
            return state.copy[prop] = createProxy(state, value);
        return value;
    } else {
        if (has(state.proxies, prop)) return state.proxies[prop];
        var _value = state.base[prop];
        if (!isProxy(_value) && isProxyable(_value)) return state.proxies[prop] = createProxy(state, _value);
        return _value;
    }
}

function set$1(state, prop, value) {
    if (!state.modified) {
        if (prop in state.base && is(state.base[prop], value) || has(state.proxies, prop) && state.proxies[prop] === value) return true;
        markChanged(state);
    }
    state.copy[prop] = value;
    return true;
}

function deleteProperty(state, prop) {
    markChanged(state);
    delete state.copy[prop];
    return true;
}

function getOwnPropertyDescriptor(state, prop) {
    var owner = state.modified ? state.copy : has(state.proxies, prop) ? state.proxies : state.base;
    var descriptor = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (descriptor && !(Array.isArray(owner) && prop === "length")) descriptor.configurable = true;
    return descriptor;
}

function defineProperty$1() {
    throw new Error("Immer does currently not support defining properties on draft objects");
}

function markChanged(state) {
    if (!state.modified) {
        state.modified = true;
        state.copy = shallowCopy(state.base);
        // copy the proxies over the base-copy
        Object.assign(state.copy, state.proxies); // yup that works for arrays as well
        if (state.parent) markChanged(state.parent);
    }
}

// creates a proxy for plain objects / arrays
function createProxy(parentState, base) {
    var state = createState(parentState, base);
    var proxy = Array.isArray(base) ? Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
    proxies.push(proxy);
    return proxy.proxy;
}

function produceProxy(baseState, producer) {
    var previousProxies = proxies;
    proxies = [];
    try {
        // create proxy for root
        var rootProxy = createProxy(undefined, baseState);
        // execute the thunk
        var returnValue = producer.call(rootProxy, rootProxy);
        // and finalize the modified proxy
        var result = finalize(rootProxy);
        // check whether the draft was modified and/or a value was returned
        if (returnValue !== undefined && returnValue !== rootProxy) {
            // something was returned, and it wasn't the proxy itself
            if (rootProxy[PROXY_STATE].modified) throw new Error(RETURNED_AND_MODIFIED_ERROR);
            result = returnValue;
        }
        // revoke all proxies
        each(proxies, function (_, p) {
            return p.revoke();
        });
        return result;
    } finally {
        proxies = previousProxies;
    }
}

// @ts-check

var descriptors = {};
var states = null;

function createState$1(parent, proxy, base) {
    return {
        modified: false,
        hasCopy: false,
        parent: parent,
        base: base,
        proxy: proxy,
        copy: undefined,
        finished: false,
        finalizing: false,
        finalized: false
    };
}

function source$1(state) {
    return state.hasCopy ? state.copy : state.base;
}

function _get(state, prop) {
    assertUnfinished(state);
    var value = source$1(state)[prop];
    if (!state.finalizing && value === state.base[prop] && isProxyable(value)) {
        // only create a proxy if the value is proxyable, and the value was in the base state
        // if it wasn't in the base state, the object is already modified and we will process it in finalize
        prepareCopy(state);
        return state.copy[prop] = createProxy$1(state, value);
    }
    return value;
}

function _set(state, prop, value) {
    assertUnfinished(state);
    if (!state.modified) {
        if (is(source$1(state)[prop], value)) return;
        markChanged$1(state);
        prepareCopy(state);
    }
    state.copy[prop] = value;
}

function markChanged$1(state) {
    if (!state.modified) {
        state.modified = true;
        if (state.parent) markChanged$1(state.parent);
    }
}

function prepareCopy(state) {
    if (state.hasCopy) return;
    state.hasCopy = true;
    state.copy = shallowCopy(state.base);
}

// creates a proxy for plain objects / arrays
function createProxy$1(parent, base) {
    var proxy = shallowCopy(base);
    each(base, function (i) {
        Object.defineProperty(proxy, "" + i, createPropertyProxy("" + i));
    });
    var state = createState$1(parent, proxy, base);
    createHiddenProperty(proxy, PROXY_STATE, state);
    states.push(state);
    return proxy;
}

function createPropertyProxy(prop) {
    return descriptors[prop] || (descriptors[prop] = {
        configurable: true,
        enumerable: true,
        get: function get$$1() {
            return _get(this[PROXY_STATE], prop);
        },
        set: function set$$1(value) {
            _set(this[PROXY_STATE], prop, value);
        }
    });
}

function assertUnfinished(state) {
    if (state.finished === true) throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process?");
}

// this sounds very expensive, but actually it is not that extensive in practice
// as it will only visit proxies, and only do key-based change detection for objects for
// which it is not already know that they are changed (that is, only object for which no known key was changed)
function markChanges() {
    // intentionally we process the proxies in reverse order;
    // ideally we start by processing leafs in the tree, because if a child has changed, we don't have to check the parent anymore
    // reverse order of proxy creation approximates this
    for (var i = states.length - 1; i >= 0; i--) {
        var state = states[i];
        if (state.modified === false) {
            if (Array.isArray(state.base)) {
                if (hasArrayChanges(state)) markChanged$1(state);
            } else if (hasObjectChanges(state)) markChanged$1(state);
        }
    }
}

function hasObjectChanges(state) {
    var baseKeys = Object.keys(state.base);
    var keys = Object.keys(state.proxy);
    return !shallowEqual(baseKeys, keys);
}

function hasArrayChanges(state) {
    return state.proxy.length !== state.base.length;
}

function produceEs5(baseState, producer) {
    var prevStates = states;
    states = [];
    try {
        // create proxy for root
        var rootProxy = createProxy$1(undefined, baseState);
        // execute the thunk
        var returnValue = producer.call(rootProxy, rootProxy);
        // and finalize the modified proxy
        each(states, function (_, state) {
            state.finalizing = true;
        });
        // find and mark all changes (for parts not done yet)
        // TODO: store states by depth, to be able guarantee processing leaves first
        markChanges();
        var result = finalize(rootProxy);
        // check whether the draft was modified and/or a value was returned
        if (returnValue !== undefined && returnValue !== rootProxy) {
            // something was returned, and it wasn't the proxy itself
            if (rootProxy[PROXY_STATE].modified) throw new Error(RETURNED_AND_MODIFIED_ERROR);
            result = returnValue;
        }
        // make sure all proxies become unusable
        each(states, function (_, state) {
            state.finished = true;
        });
        return result;
    } finally {
        states = prevStates;
    }
}

function shallowEqual(objA, objB) {
    //From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
    if (is(objA, objB)) return true;
    if ((typeof objA === "undefined" ? "undefined" : _typeof$1(objA)) !== "object" || objA === null || (typeof objB === "undefined" ? "undefined" : _typeof$1(objB)) !== "object" || objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) return false;
    for (var i = 0; i < keysA.length; i++) {
        if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}

function createHiddenProperty(target, prop, value) {
    Object.defineProperty(target, prop, {
        value: value,
        enumerable: false,
        writable: true
    });
}

/**
 * produce takes a state, and runs a function against it.
 * That function can freely mutate the state, as it will create copies-on-write.
 * This means that the original state will stay unchanged, and once the function finishes, the modified state is returned
 *
 * @export
 * @param {any} baseState - the state to start with
 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
 * @returns {any} a new state, or the base state if nothing was modified
 */
function produce(baseState, producer) {
    // curried invocation
    if (arguments.length === 1) {
        var _producer = baseState;
        // prettier-ignore
        if (typeof _producer !== "function") throw new Error("if produce is called with 1 argument, the first argument should be a function");
        return function () {
            var args = arguments;
            return produce(args[0], function (draft) {
                args[0] = draft; // blegh!
                return _producer.apply(draft, args);
            });
        };
    }

    // prettier-ignore
    {
        if (arguments.length !== 2) throw new Error("produce expects 1 or 2 arguments, got " + arguments.length);
        if (typeof producer !== "function") throw new Error("the second argument to produce should be a function");
    }

    // it state is a primitive, don't bother proxying at all and just return whatever the producer returns on that value
    if ((typeof baseState === "undefined" ? "undefined" : _typeof$1(baseState)) !== "object" || baseState === null) return producer(baseState);
    if (!isProxyable(baseState)) throw new Error("the first argument to an immer producer should be a primitive, plain object or array, got " + (typeof baseState === "undefined" ? "undefined" : _typeof$1(baseState)) + ": \"" + baseState + "\"");
    return getUseProxies() ? produceProxy(baseState, producer) : produceEs5(baseState, producer);
}

var createReducer = function createReducer(defIn) {
  var def = getDefWithDefaults(defIn);

  var actionMap = createActionMap(def);
  var reducer = function reducer(previousState, _ref) {
    var type = _ref.type,
        payload = _ref.payload;

    if (!previousState) {
      return def.defaultState;
    }
    return produce(previousState, function (draft) {
      var action = actionMap[type];
      action && action(draft, payload);
    });
  };
  return reducer;
};

var createReducers = function createReducers(defs) {
  var reducers = {};
  Object.keys(defs).forEach(function (key) {
    return reducers[key] = createReducer(defs[key]);
  });
  return reducers;
};

function takeKeys(obj, keys) {
  var next = {};
  keys.forEach(function (key) {
    return next[key] = obj[key];
  });
  return next;
}

function easyConnect$1() {
  for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  return easyConnect(function (state, ownProps, actions) {
    return _extends({}, takeKeys(state, keys), {
      actions: takeKeys(actions, keys)
    });
  });
}

function getStore(modules) {
  var argsToPassToAsyncActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var reducers = createReducers(modules);
  var store = redux.createStore(redux.combineReducers(reducers));
  //anything passed into the third argument of get actions will all be passed into asyncAction handlers on any module
  var actions = getActions(modules, store, argsToPassToAsyncActions);
  store.actions = actions;
  return store;
}

var connect = easyConnect;
var quickConnect = easyConnect$1;

var index = {
  connectWithActions: easyConnect,
  getActions: getActions,
  createActionMap: createActionMap,
  generateActionCreators: generateActionCreators,
  createReducer: createReducer,
  createReducers: createReducers,
  connect: connect,
  easyConnect: easyConnect$1,
  quickConnect: quickConnect,
  createStore: getStore
};

module.exports = index;
