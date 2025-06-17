import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { BrowserRouter, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Route path="/signin" element={<App />} />
    </BrowserRouter>
  </React.StrictMode>,
);
