import {connect} from 'react-redux';
import registry from './registry';

export default function easyConnect(...args) {
  let nextArgs = [...args];
  nextArgs[0] = function(...mapStateToPropsArguments) {
    return args[0](...mapStateToPropsArguments, registry.get('actions'));
  }
  return connect(...nextArgs);
}