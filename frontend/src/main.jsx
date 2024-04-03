import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
}

import { createRoot } from 'react-dom/client'; // Import createRoot from react-dom/client

createRoot(document.getElementById('root')).render( // Use createRoot from react-dom/client
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
