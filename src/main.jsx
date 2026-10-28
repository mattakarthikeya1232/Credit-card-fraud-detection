
import React from "react";
import { createRoot } from "react-dom/client";
import FraudDetection from "./FraudDetection";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FraudDetection />
  </React.StrictMode>
);
