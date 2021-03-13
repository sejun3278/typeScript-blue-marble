import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import './style/config.css';

import { Provider } from 'react-redux';
import Store from './Store';

import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render( 
  <Provider store={Store}> 
    <App /> 
  </Provider>, 
document.getElementById('root') as HTMLElement );

reportWebVitals();
