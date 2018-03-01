import {connect} from 'react-redux';

let actions = {};

export function registerActions(actionsIn) {
  actions = actionsIn;
}

export default function easyConnect(...args) {
  let nextArgs = [...args];
  nextArgs[0] = function(...mapStateToPropsArguments) {
    return args[0](...mapStateToPropsArguments, actions);
  }
  return connect(...nextArgs);
}