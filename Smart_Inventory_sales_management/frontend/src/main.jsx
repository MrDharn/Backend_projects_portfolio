import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { LayoutProvider } from "./context/LayoutContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LayoutProvider>
        <App />
      </LayoutProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
