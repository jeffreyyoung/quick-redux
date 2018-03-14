import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'quick-redux';
import counterModule from './counterModule';
import App from './App';

const store = createStore({
  counter: counterModule
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
