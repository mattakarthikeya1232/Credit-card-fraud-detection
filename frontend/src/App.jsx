
import { useState } from "react";
import "./App.css";

const sections = [
  { id: "overview", label: "Overview", icon: "◫" },
  { id: "detect", label: "Fraud Detection", icon: "⌕" },
  { id: "transactions", label: "Transactions", icon: "▤" },
  { id: "analytics", label: "Model Analytics", icon: "▥" },
];

const stats = [
  { label: "Transactions Analyzed", value: "12,480", note: "Demo data", icon: "↗" },
  { label: "Fraud Alerts", value: "186", note: "Demo data", icon: "⚑" },
  { label: "Detection Rate", value: "94.2%", note: "Illustrative only", icon: "◎" },
  { label: "Model Status", value: "Demo Mode", note: "Model not connected", icon: "◇" },
];

const demoTransactions = [
  { id: "TXN-10482", amount: "₹24,500", time: "10:42 AM", status: "Flagged" },
  { id: "TXN-10481", amount: "₹1,250", time: "10:38 AM", status: "Legitimate" },
  { id: "TXN-10480", amount: "₹78,900", time: "10:31 AM", status: "Flagged" },
  { id: "TXN-10479", amount: "₹640", time: "10:25 AM", status: "Legitimate" },
  { id: "TXN-10478", amount: "₹12,300", time: "10:19 AM", status: "Review" },
];

function App() {
  const [activeSection, setActiveSection] = useState("overview");

  const activeLabel =
    sections.find((section) => section.id === activeSection)?.label ?? "Overview";

  function renderPage() {
    if (activeSection === "detect") {
      return (
        <section className="panel feature-panel">
          <span className="eyebrow">PREDICTION WORKSPACE</span>
          <h2>Fraud Detection</h2>
          <p className="muted">
            This screen will connect to your trained LightGBM model after the API is ready.
          </p>
          <div className="integration-box">
            <span className="status-dot" />
            <div>
              <strong>Model not connected yet</strong>
              <p>Predictions are not being generated. No real transaction is being evaluated.</p>
            </div>
          </div>
          <button className="primary-button" onClick={() => alert("Demo only — model API is not connected.")}>
            Check integration status
          </button>
        </section>
      );
    }

    if (activeSection === "transactions") {
      return <Transactions />;
    }

    if (activeSection === "analytics") {
      return (
        <section className="panel feature-panel">
          <span className="eyebrow">RESEARCH RESULTS</span>
          <h2>Model Analytics</h2>
          <p className="muted">
            This section is reserved for your research results comparing baseline,
            class weighting, SMOTENC and random undersampling.
          </p>
          <div className="research-grid">
            <div><span>Validation</span><strong>Randomized + Chronological</strong></div>
            <div><span>Primary metric</span><strong>PR-AUC / Average Precision</strong></div>
            <div><span>Model</span><strong>LightGBM</strong></div>
            <div><span>Data</span><strong>IEEE-CIS Fraud Detection</strong></div>
          </div>
          <p className="note">Research context only — final verified metrics will be added here.</p>
        </section>
      );
    }

    return (
      <>
        <section className="welcome">
          <div>
            <span className="eyebrow">FRAUD MONITORING WORKSPACE</span>
            <h2>Good afternoon 👋</h2>
            <p>Monitor transaction activity and review your fraud detection research in one place.</p>
          </div>
          <button className="primary-button" onClick={() => setActiveSection("detect")}>
            + New analysis
          </button>
        </section>

        <div className="demo-banner">
          <span>ⓘ</span>
          <p><strong>Demo mode:</strong> All dashboard counts and transaction records below are sample data, not live model predictions.</p>
        </div>

        <section className="stats-grid">
          {stats.map((stat) => (
            <article className="stat-card" key={stat.label}>
              <div className="stat-top">
                <span>{stat.label}</span>
                <span className="stat-icon">{stat.icon}</span>
              </div>
              <h3>{stat.value}</h3>
              <p>{stat.note}</p>
            </article>
          ))}
        </section>

        <section className="content-grid">
          <div className="panel activity-panel">
            <div className="panel-heading">
              <div>
                <h3>Transaction activity</h3>
                <p className="muted">Illustrative recent records</p>
              </div>
              <button className="text-button" onClick={() => setActiveSection("transactions")}>
                View all →
              </button>
            </div>
            <div className="activity-visual" aria-label="Illustrative transaction activity chart">
              {[42, 68, 50, 78, 57, 88, 63, 72, 45, 92, 67, 80].map((height, index) => (
                <div className="bar-wrap" key={index}>
                  <div className={`bar ${index === 9 ? "bar-highlight" : ""}`} style={{ height: `${height}%` }} />
                </div>
              ))}
            </div>
            <div className="chart-labels"><span>Morning</span><span>Afternoon</span><span>Evening</span></div>
          </div>

          <div className="panel status-panel">
            <div className="panel-heading">
              <div><h3>System status</h3><p className="muted">Integration readiness</p></div>
            </div>
            <div className="status-row">
              <span className="status-dot neutral" />
              <div><strong>Frontend</strong><p>Running locally</p></div>
              <span className="status-tag ready">Ready</span>
            </div>
            <div className="status-row">
              <span className="status-dot pending" />
              <div><strong>LightGBM model API</strong><p>Awaiting integration</p></div>
              <span className="status-tag pending-tag">Pending</span>
            </div>
            <div className="status-row">
              <span className="status-dot pending" />
              <div><strong>Live data source</strong><p>Not configured</p></div>
              <span className="status-tag pending-tag">Pending</span>
            </div>
          </div>
        </section>

        <Transactions compact />
      </>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div><strong>Sentinel</strong><span>FRAUD INTELLIGENCE</span></div>
        </div>

        <div className="nav-caption">WORKSPACE</div>
        <nav>
          {sections.map((section) => (
            <button
              key={section.id}
              className={`nav-item ${activeSection === section.id ? "active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              {section.label}
              {section.id === "detect" && <span className="nav-arrow">›</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help"> 
            <div className="help-icon">?</div>
            <strong>Research project</strong>
            <p>IEEE-CIS Fraud Detection</p>
            <span>LightGBM · Class imbalance</span>
          </div>
          <div className="profile">
            <div className="avatar">M1</div>
            <div><strong>Project Team</strong><span>Frontend workspace</span></div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{activeLabel}</strong></div>
          <div className="topbar-right">
            <span className="demo-pill"><span /> DEMO ENVIRONMENT</span>
            <div className="top-avatar">M1</div>
          </div>
        </header>

        <div className="page-content">
          {renderPage()}
          <footer>Credit Card Fraud Detection Research · LightGBM · <span>Demo frontend — no live predictions</span></footer>
        </div>
      </main>
    </div>
  );
}

function Transactions({ compact = false }) {
  const [search, setSearch] = useState("");
  const rows = demoTransactions.filter((item) =>
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="panel transactions-panel">
      <div className="panel-heading transactions-heading">
        <div>
          <h3>{compact ? "Recent transactions" : "Transaction history"}</h3>
          <p className="muted">Sample records for layout testing</p>
        </div>
        {!compact && (
          <input
            className="search-input"
            placeholder="Search transaction ID..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        )}
        {compact && <span className="sample-label">SAMPLE DATA</span>}
      </div>

      <div className="table-scroll">
        <table>
          <thead><tr><th>TRANSACTION ID</th><th>AMOUNT</th><th>TIME</th><th>STATUS</th></tr></thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td className="transaction-id">{item.id}</td>
                <td>{item.amount}</td>
                <td>{item.time}</td>
                <td><span className={`transaction-status ${item.status.toLowerCase()}`}>{item.status}</span></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="4" className="empty-state">No matching sample transactions.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;
