import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from './redux/store'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  BrowserRouter
} from "react-router-dom";
const theme = createTheme({
  typography: {
    fontFamily: 'misans',
  },
  palette: {
    primary: {
      main: '#fb61ee',
      light: 'rgb(248, 195, 248)'
    },
    secondary: {
      light: '#fff',
      main: '#fb61ee',
      contrastText: '#fff',
    },
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
   <Provider store={store}>
  <ThemeProvider theme={theme}>
  <App/>
  </ThemeProvider>
  </Provider>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
