import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/index.css";
import App from "./App";
import { ThemeToggleProvider } from "./contexts/ThemeContext";
import { CssBaseline } from "@mui/material";
import { WebSocketProvider } from "./contexts/WebSocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeToggleProvider>
      <WebSocketProvider>
        <CssBaseline />
        <Router>
          <App />
        </Router>
      </WebSocketProvider>
    </ThemeToggleProvider>
  </React.StrictMode>
);
