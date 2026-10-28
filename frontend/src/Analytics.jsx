import React, { useMemo, useState } from "react";
import "./Analytics.css";

/*
 * All supplied research data lives in this object.
 * Replace null values with measured results from your evaluation pipeline.
 * This screen shows offline research results, not live fraud predictions.
 */
export const analyticsData = {
  metadata: {
    title: "Credit Card Fraud Detection",
    model: "LightGBM",
    status: "Offline research results",
    lastUpdated: null,
  },
  evaluationSetups: {
    randomizedCV: {
      label: "Randomized CV",
      description: "Mean PR-AUC across randomized cross-validation folds.",
    },
    chronological: {
      label: "Chronological",
      description: "Evaluation using chronological data ordering.",
    },
  },
  methods: [
    {
      id: "baseline",
      name: "Baseline LightGBM",
      shortName: "Baseline",
      color: "#8190ff",
      metrics: {
        randomizedCV: { prAuc: 0.7109, precision: null, recall: null, f1: null, f2: null, mcc: null },
        chronological: { prAuc: 0.523940, precision: null, recall: null, f1: null, f2: null, mcc: null },
      },
    },
    {
      id: "weighted",
      name: "Class-weighted LightGBM",
      shortName: "Class weighted",
      color: "#2dd4bf",
      metrics: {
        randomizedCV: { prAuc: 0.6696, precision: null, recall: null, f1: null, f2: null, mcc: null },
        chronological: { prAuc: 0.527906, precision: null, recall: null, f1: null, f2: null, mcc: null },
      },
    },
    {
      id: "smotenc",
      name: "SMOTENC",
      shortName: "SMOTENC",
      color: "#fbbf24",
      metrics: {
        randomizedCV: { prAuc: 0.6527, precision: null, recall: null, f1: null, f2: null, mcc: null },
        chronological: { prAuc: 0.520928, precision: null, recall: null, f1: null, f2: null, mcc: null },
      },
    },
    {
      id: "undersampling",
      name: "Random undersampling",
      shortName: "Undersampling",
      color: "#f472b6",
      metrics: {
        randomizedCV: { prAuc: 0.5608, precision: null, recall: null, f1: null, f2: null, mcc: null },
        chronological: { prAuc: 0.484363, precision: null, recall: null, f1: null, f2: null, mcc: null },
      },
    },
  ],
  researchNotes: [
    "These are offline research results, not live model predictions.",
    "Resampling pilots used reduced training samples.",
    "Randomized cross-validation and chronological evaluation use different evaluation setups; interpret cross-setup comparisons with that limitation in mind.",
  ],
};

const metricDefinitions = [
  { key: "prAuc", label: "PR-AUC", description: "Area under the precision-recall curve", format: (v) => v.toFixed(6).replace(/0+$/, "").replace(/\.$/, "") },
  { key: "precision", label: "Precision", description: "Share of flagged transactions that are fraud", format: (v) => `${(v * 100).toFixed(2)}%` },
  { key: "recall", label: "Recall", description: "Share of fraud cases detected", format: (v) => `${(v * 100).toFixed(2)}%` },
  { key: "f1", label: "F1 Score", description: "Balance between precision and recall", format: (v) => v.toFixed(4) },
  { key: "f2", label: "F2 Score", description: "F-score that gives more weight to recall", format: (v) => v.toFixed(4) },
  { key: "mcc", label: "MCC", description: "Matthews correlation coefficient", format: (v) => v.toFixed(4) },
];

function isNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatMetric(value, formatter) {
  return isNumber(value) ? formatter(value) : "N/A";
}

function bestMethod(methods, setup, metric) {
  const available = methods
    .map((method) => ({ ...method, value: method.metrics[setup][metric] }))
    .filter((method) => isNumber(method.value));
  return available.length
    ? available.reduce((best, current) => current.value > best.value ? current : best)
    : null;
}

function MetricCard({ metric, value, isBest }) {
  return (
    <article className="analytics-metric-card">
      <div className="metric-card-top">
        <span className="metric-label">{metric.label}</span>
        <span className="metric-symbol" aria-hidden="true">{metric.key === "prAuc" ? "↗" : "◈"}</span>
      </div>
      <div className="metric-value">{formatMetric(value, metric.format)}</div>
      <p className="metric-description">{metric.description}</p>
      <div className="metric-foot">
        <span className={isBest ? "best-label" : ""}>
          {isBest ? "Best available result" : "Offline evaluation"}
        </span>
      </div>
    </article>
  );
}

function ComparisonChart({ title, description, methods, setup, metric }) {
  const definition = metricDefinitions.find((item) => item.key === metric);
  const best = bestMethod(methods, setup, metric);

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="chart-unit">{metric === "prAuc" ? "AUC · 0–1" : "Recall · 0–100%"}</span>
      </div>

      <div className="bar-chart" role="img" aria-label={`${title} for ${analyticsData.evaluationSetups[setup].label}`}>
        {methods.map((method) => {
          const value = method.metrics[setup][metric];
          const valid = isNumber(value);
          return (
            <div className="bar-row" key={method.id}>
              <div className="bar-label">
                <span className="method-dot" style={{ backgroundColor: method.color }} />
                <span>{method.shortName}</span>
              </div>
              <div className="bar-track">
                {valid ? (
                  <div className="bar-fill" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%`, backgroundColor: method.color }} />
                ) : (
                  <div className="bar-missing" />
                )}
              </div>
              <span className="bar-value">{formatMetric(value, definition.format)}</span>
            </div>
          );
        })}
      </div>

      {best ? (
        <div className="chart-insight">
          <span className="insight-star" aria-hidden="true">✦</span>
          <span>Highest {definition.label}: <strong>{best.name}</strong> ({definition.format(best.value)})</span>
        </div>
      ) : (
        <div className="chart-insight muted-insight">
          Recall values have not been supplied. Add measured results to analyticsData to show this chart.
        </div>
      )}
    </section>
  );
}

function ComparisonTable({ methods, setup }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Method comparison</h2>
          <p>All six metrics for the selected evaluation setup.</p>
        </div>
      </div>
      <div className="table-scroll">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Method</th>
              {metricDefinitions.map((metric) => <th key={metric.key}>{metric.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {methods.map((method) => (
              <tr key={method.id}>
                <td>
                  <div className="table-method">
                    <span className="method-dot" style={{ backgroundColor: method.color }} />
                    <span>{method.name}</span>
                  </div>
                </td>
                {metricDefinitions.map((metric) => (
                  <td key={metric.key}>{formatMetric(method.metrics[setup][metric.key], metric.format)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="table-note">N/A means a measured value was not provided; it does not mean zero.</p>
    </section>
  );
}

export default function Analytics() {
  const [setup, setSetup] = useState("randomizedCV");
  const [selectedMethod, setSelectedMethod] = useState("baseline");
  const methods = analyticsData.methods;

  const selected = useMemo(
    () => methods.find((method) => method.id === selectedMethod) || methods[0],
    [methods, selectedMethod]
  );
  const selectedMetrics = selected.metrics[setup];
  const bestPrAuc = bestMethod(methods, setup, "prAuc");
  const bestRecall = bestMethod(methods, setup, "recall");

  return (
    <main className="analytics-page">
      <header className="page-header">
        <div>
          <div className="eyebrow"><span className="status-dot" /> OFFLINE MODEL EVALUATION</div>
          <h1>Analytics Overview</h1>
          <p className="page-subtitle">Credit card fraud detection <span className="subtitle-separator">·</span> LightGBM model performance</p>
        </div>
        <div className="research-badge"><span className="status-dot" /> Research dataset</div>
      </header>

      <section className="research-banner">
        <div className="info-icon" aria-hidden="true">i</div>
        <div>
          <strong>Research results, not live predictions</strong>
          <p>This dashboard displays supplied offline evaluation results. It does not process live transactions or predict fraud in real time.</p>
        </div>
      </section>

      <section className="evaluation-controls">
        <div>
          <span className="section-kicker">EVALUATION SETUP</span>
          <h2>Compare evaluation strategies</h2>
          <p>Switch between randomized cross-validation and chronological evaluation.</p>
        </div>
        <div className="segmented-control" role="group" aria-label="Evaluation setup">
          {Object.entries(analyticsData.evaluationSetups).map(([key, config]) => (
            <button
              key={key}
              type="button"
              className={setup === key ? "segment segment-active" : "segment"}
              onClick={() => setSetup(key)}
              aria-pressed={setup === key}
            >
              {config.label}
            </button>
          ))}
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card summary-primary">
          <div className="summary-label">Best available PR-AUC</div>
          <div className="summary-value">{bestPrAuc ? bestPrAuc.value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "") : "N/A"}</div>
          <div className="summary-bottom"><span>{bestPrAuc?.name || "No data available"}</span><span className="summary-tag">PR-AUC</span></div>
        </article>
        <article className="summary-card">
          <div className="summary-label">Best available recall</div>
          <div className="summary-value">{bestRecall ? `${(bestRecall.value * 100).toFixed(2)}%` : "N/A"}</div>
          <div className="summary-bottom"><span>{bestRecall?.name || "Awaiting measured results"}</span><span className="summary-tag">Recall</span></div>
        </article>
        <article className="summary-card">
          <div className="summary-label">Methods evaluated</div>
          <div className="summary-value">{methods.length}</div>
          <div className="summary-bottom"><span>Model configurations</span><span className="summary-tag">4 methods</span></div>
        </article>
      </section>

      <section className="metrics-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">PERFORMANCE INDICATORS</span>
            <h2>Selected model metrics</h2>
            <p>Viewing {selected.name} · {analyticsData.evaluationSetups[setup].label}</p>
          </div>
          <label className="method-select">
            <span>Model method</span>
            <select value={selectedMethod} onChange={(event) => setSelectedMethod(event.target.value)}>
              {methods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
            </select>
          </label>
        </div>
        <div className="metrics-grid">
          {metricDefinitions.map((metric) => (
            <MetricCard
              key={metric.key}
              metric={metric}
              value={selectedMetrics[metric.key]}
              isBest={metric.key === "prAuc" && bestPrAuc?.id === selectedMethod}
            />
          ))}
        </div>
      </section>

      <section className="charts-grid">
        <ComparisonChart
          title="PR-AUC comparison"
          description="Precision-recall performance across all methods."
          methods={methods}
          setup={setup}
          metric="prAuc"
        />
        <ComparisonChart
          title="Recall comparison"
          description="Fraud detection coverage across all methods."
          methods={methods}
          setup={setup}
          metric="recall"
        />
      </section>

      <ComparisonTable methods={methods} setup={setup} />

      <section className="panel notes-panel">
        <div className="notes-heading">
          <span className="warning-icon" aria-hidden="true">!</span>
          <div>
            <h2>Research notes and limitations</h2>
            <p>Keep these limitations in mind when interpreting results.</p>
          </div>
        </div>
        <ul className="notes-list">
          {analyticsData.researchNotes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </section>

      <footer className="analytics-footer">
        <span>{analyticsData.metadata.title} · {analyticsData.metadata.model}</span>
        <span>Offline evaluation dashboard</span>
      </footer>
    </main>
  );
}
