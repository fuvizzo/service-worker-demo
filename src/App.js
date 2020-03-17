import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from './components/List';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://blog.bitsrc.io/build-progressive-web-apps-with-react-part-1-63f1fbc564a6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Build Progressive Web Apps with React
        </a>
      </header>

      <List />
    </div>
  );
}

export default App;
