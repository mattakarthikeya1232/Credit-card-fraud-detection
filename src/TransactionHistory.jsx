import React, { useMemo, useState } from "react";
import "./TransactionHistory.css";

// Replace this single mock-data array with records from your backend API.
const MOCK_TRANSACTIONS = [
  { id: "TXN-10482", amount: 284.50, time: "2025-02-18T14:32:00", category: "Online shopping", prediction: "Legitimate", status: "Completed" },
  { id: "TXN-10481", amount: 1299.99, time: "2025-02-18T13:08:00", category: "Electronics", prediction: "Fraud", status: "Under review" },
  { id: "TXN-10480", amount: 42.75, time: "2025-02-18T11:46:00", category: "Dining", prediction: "Legitimate", status: "Completed" },
  { id: "TXN-10479", amount: 875.00, time: "2025-02-17T22:19:00", category: "Travel", prediction: "Pending", status: "Processing" },
  { id: "TXN-10478", amount: 16.20, time: "2025-02-17T18:54:00", category: "Groceries", prediction: "Legitimate", status: "Completed" },
  { id: "TXN-10477", amount: 2190.00, time: "2025-02-17T09:15:00", category: "Cash withdrawal", prediction: "Fraud", status: "Blocked" },
];

const formatAmount = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
const formatTime = (time) => new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(time));
const className = (value) => value.toLowerCase().replaceAll(" ", "-");

export default function TransactionHistory() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("newest");
  const transactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_TRANSACTIONS.filter((item) => {
      const matchesSearch = !query || [item.id, item.category, item.prediction, item.status].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (status === "All" || item.status === status);
    }).sort((a, b) => (sort === "newest" ? -1 : 1) * (new Date(a.time) - new Date(b.time)));
  }, [search, status, sort]);

  return <main className="th-page">
    <header className="th-topbar"><a className="th-brand" href="#home"><span className="th-logo">C</span> CardGuard<span className="th-blue">.</span></a><span className="th-model"><i /> LIGHTGBM MODEL ACTIVE</span></header>
    <section className="th-content">
      <div className="th-kicker">FRAUD MONITORING <span>•</span> LIVE VIEW</div>
      <div className="th-heading"><div><h1>Transaction history</h1><p>Monitor card activity and review fraud detection predictions.</p></div><span className="th-live"><i /> System online</span></div>
      <section className="th-summary" aria-label="Summary"><article><span>Total transactions</span><strong>{MOCK_TRANSACTIONS.length.toString().padStart(2, "0")}</strong><small>Across all payment categories</small></article><article><span>Flagged as fraud</span><strong className="th-red">{MOCK_TRANSACTIONS.filter(x => x.prediction === "Fraud").length.toString().padStart(2, "0")}</strong><small>Requires review</small></article><article><span>Legitimate payments</span><strong className="th-green">{MOCK_TRANSACTIONS.filter(x => x.prediction === "Legitimate").length.toString().padStart(2, "0")}</strong><small>Cleared by model</small></article><article><span>Model confidence</span><strong>98.4<span className="th-percent">%</span></strong><small>LightGBM classification</small></article></section>
      <section className="th-card" aria-labelledby="th-title">
        <div className="th-card-heading"><div><h2 id="th-title">Recent transactions</h2><p>Review transaction details and model outcomes.</p></div><span className="th-count">{transactions.length} records</span></div>
        <div className="th-controls"><label className="th-search"><span aria-hidden="true">⌕</span><span className="sr-only">Search transactions</span><input type="search" placeholder="Search ID, category, prediction..." value={search} onChange={e => setSearch(e.target.value)} /></label><label className="sr-only" htmlFor="th-status">Filter by status</label><select id="th-status" value={status} onChange={e => setStatus(e.target.value)}><option>All</option><option>Completed</option><option>Under review</option><option>Processing</option><option>Blocked</option></select><label className="sr-only" htmlFor="th-sort">Sort transactions</label><select id="th-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></div>
        <div className="th-table-wrap"><table><thead><tr><th>TRANSACTION ID</th><th>AMOUNT</th><th>TRANSACTION TIME</th><th>PAYMENT CATEGORY</th><th>PREDICTION</th><th>STATUS</th></tr></thead><tbody>{transactions.map(item => <tr key={item.id}><td data-label="Transaction ID"><strong className="th-id">{item.id}</strong></td><td data-label="Amount" className="th-amount">{formatAmount(item.amount)}</td><td data-label="Transaction time">{formatTime(item.time)}</td><td data-label="Payment category">{item.category}</td><td data-label="Prediction"><span className={`th-badge th-badge--${className(item.prediction)}`}><i />{item.prediction}</span></td><td data-label="Status"><span className={`th-status th-status--${className(item.status)}`}>{item.status}</span></td></tr>)}</tbody></table>
          {transactions.length === 0 && <div className="th-empty"><span className="th-empty-icon">⌕</span><h3>No transactions found</h3><p>Try changing your search or status filter.</p><button onClick={() => { setSearch(""); setStatus("All"); }}>Clear filters</button></div>}
        </div><footer className="th-footer">Showing {transactions.length} of {MOCK_TRANSACTIONS.length} transactions <span>Fraud detection powered by LightGBM</span></footer>
      </section>
      <footer className="th-bottom">CREDIT CARD FRAUD DETECTION <span>DEMO DASHBOARD</span></footer>
    </section>
  </main>;
}


