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
      main: '#f59fe9',
      light: 'rgb(252, 91, 214)'
    },
    secondary: {
      light: '#fff',
      main: '#1976d2',
      contrastText: '#fff',
    },
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <Provider store={store}>
  <ThemeProvider theme={theme}>
  <App/>
  </ThemeProvider>
  </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
