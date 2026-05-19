import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthLoader from "./components/auth/AuthLoader";

import { Provider } from "react-redux";
import store from "./app/store";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthLoader />
      <App />
      <Toaster position="top-right" />
    </Provider>
  </React.StrictMode>,
);
