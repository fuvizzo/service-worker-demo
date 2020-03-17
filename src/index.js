import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const renderApp = () =>
  ReactDOM.render(<App />, document.getElementById('root'));

// Learn more about service workers: https://bit.ly/CRA-PWA
if ('serviceWorker' in navigator) {
  if (!navigator.serviceWorker.controller)
    serviceWorker.register({
      onActivated: renderApp,
    });
  else {
    renderApp();
  }
} else {
  renderApp();
}
