import React, { Component } from 'react';
import {connect, inject} from 'quick-redux';

const App = (props) => (
  <div>
    <div>{JSON.stringify(props, null, 3)}</div>
    <p>{props.count}</p>
    <button onClick={() => props.actions.counter.increment()}>increment</button>
    <button onClick={() => props.actions.counter.decrement()}>decrement</button>
  </div>
)

const enhance = inject(
  'counter.stateWithOdd'
);

export default enhance(App);
