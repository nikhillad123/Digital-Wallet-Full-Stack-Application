import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/variables.css";
import "./styles/globals.css";

import App from "./App";

import { ToastProvider } from "./context/ToastContext";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ToastProvider>
            <App />
        </ToastProvider>
    </React.StrictMode>
);