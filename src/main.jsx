import React from "react";
import { createRoot } from "react-dom/client";
import TransactionHistory from "./TransactionHistory.jsx";
import "./app.css";
createRoot(document.getElementById("root")).render(<React.StrictMode><TransactionHistory /></React.StrictMode>);
