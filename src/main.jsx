import React from "react";
import ReactDOM from "react-dom/client";
import { AppProvider } from "./context";
import App from "./App";
import "./css/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
