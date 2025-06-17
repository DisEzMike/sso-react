import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { GoogleOAuthProvider } from '@react-oauth/google';

import App from "./App";
import NotFound from "./404";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.clientID!}>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<App />} />
          <Route path="/" element={<Navigate to={'/signin'} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
