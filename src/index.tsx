import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import styled from 'styled-components';
import { Provider } from "react-redux";
import store from "./store";

const LimeLogo = styled.a`
  display: block;
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background-image: url('/lime-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
`;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <LimeLogo href='https://oilylime.com' target="_blank" rel="noopener noreferrer" />
    </Provider>
  </React.StrictMode>
);
