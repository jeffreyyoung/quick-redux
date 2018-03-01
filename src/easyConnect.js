import connectWithActions from './connectWithActions';

let actions = {};

function takeKeys(obj, keys) {
  let next = {};
  keys.forEach(key => next[key] = obj[key]);
  return next;
}

export default function easyConnect(...keys) {
  
  return connectWithActions((state, ownProps, actions) => {
    return {
      ...takeKeys(state, keys),
      actions: takeKeys(actions, keys)
    };
  });
}