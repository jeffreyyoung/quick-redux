import React, { Component } from 'react';
import {connect} from 'quick-redux';

console.log('CONNECT!!!', connect);

const App = ({count, actions}) => (
  <div>
    <p>{count}</p>
    <button onClick={() => actions.increment()}>increment</button>
    <button onClick={() => actions.decrement()}>decrement</button>
  </div>
)

const enhance = connect(
  (state, ownProps, actions) => ({
    count: state.counter.count,
    actions: actions.counter,
  })
);

export default enhance(App);
