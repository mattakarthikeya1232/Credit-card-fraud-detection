# Credit Card Fraud Detection — Frontend

A React + Vite frontend for the LightGBM fraud detection analytics screen.

## Requirements
- Node.js LTS (includes npm)
- Visual Studio Code

## Run it
1. Extract this folder if you downloaded the ZIP.
2. Open the `fraud-detection-frontend` folder in VS Code.
3. Choose Terminal → New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local URL printed in the terminal (typically http://localhost:5173).

## Included
- `src/Analytics.jsx`: reusable analytics component and centralized `analyticsData`.
- `src/Analytics.css`: component styling and responsive CSS charts.
- `src/App.jsx`: mounts the Analytics component for this standalone starter.
- `src/main.jsx`: React entry point.
- `src/index.css`: minimal global reset.
- `package.json`, `index.html`: Vite project configuration.

## Research data note
Only the supplied PR-AUC values are populated. Precision, recall, F1, F2, and MCC are `null` and render as `N/A` until actual measured results are provided. These are offline research results, not live model predictions. Resampling pilots used reduced training samples, and evaluation setups differ.

To update the values, edit the exported `analyticsData` object in `src/Analytics.jsx`.
