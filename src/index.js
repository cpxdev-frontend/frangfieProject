import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const theme = createTheme({
  typography: {
    // fontFamily: "misans",
    fontFamily: "Noto Sans Thai",
  },
  palette: {
    primary: {
      main: "#fb61ee",
      light: "rgb(248, 195, 248)",
    },
    secondary: {
      light: "#fff",
      main: "#fb61ee",
      contrastText: "#fff",
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

// root.render(
//   <BrowserRouter>
//     <Auth0Provider
//       domain="dev-d3z2gthipqxs3ba7.us.auth0.com"
//       clientId="yiu6OP37hDGjWt5ij1Y1ZAXKDOLM7Ex3"
//       authorizationParams={{
//         redirect_uri: window.location.origin,
//       }}>
//       <Provider store={store}>
//         <ThemeProvider theme={theme}>
//           <App />
//         </ThemeProvider>
//       </Provider>
//     </Auth0Provider>
//   </BrowserRouter>
// );
root.render(
  <BrowserRouter>
    <KindeProvider
      domain="https://cpxdev.kinde.com"
      clientId="2b415888d4004e2eb58cef8921d46f3d"
      logoutUri={window.location.origin}
      redirectUri={window.location.origin}
    >
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </KindeProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
