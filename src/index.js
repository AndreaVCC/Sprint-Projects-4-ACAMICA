import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import ProtectedContext from './context/Protected'


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ProtectedContext>
        <App />
      </ProtectedContext>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
