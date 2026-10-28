
import React, { useState } from "react";
import "./FraudDetection.css";

/*
 * DEMO ONLY:
 * This function uses simple mock rules, not a trained LightGBM model.
 * Replace this function with a fetch() request to your backend API
 * when your Colab-trained model is deployed.
 */
async function mockFraudPrediction(transaction) {
  // Simulate API response time for the loading state.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const amount = Number(transaction.amount);
  const hour = Number(transaction.transactionTime.split(":")[0]);

  // Illustrative rules only — not real fraud detection.
  const suspicious =
    amount >= 50000 ||
    (amount >= 20000 && hour >= 0 && hour < 5) ||
    transaction.deviceType === "Unknown device";

  // A placeholder score, not a calibrated probability.
  const riskScore = suspicious ? 82 : amount >= 10000 ? 38 : 12;

  return {
    prediction: suspicious ? "Fraud" : "Legitimate",
    riskScore,
    message: suspicious
      ? "This demo identified transaction attributes that match its illustrative risk rules. Further verification is recommended."
      : "This demo did not identify attributes that trigger its illustrative risk rules. This is not a guarantee that the transaction is safe.",
  };
}

const initialForm = {
  amount: "",
  transactionTime: "",
  productCategory: "",
  cardType: "",
  emailDomain: "",
  transactionType: "",
  merchant: "",
  country: "",
  deviceType: "",
};

const fields = [
  {
    name: "amount",
    label: "Transaction amount",
    type: "number",
    placeholder: "e.g. 2499.00",
    required: true,
    min: "0.01",
    step: "0.01",
    prefix: "₹",
    hint: "Enter the amount in INR.",
  },
  {
    name: "transactionTime",
    label: "Transaction time",
    type: "time",
    required: true,
    hint: "Local transaction time.",
  },
  {
    name: "merchant",
    label: "Merchant name",
    type: "text",
    placeholder: "e.g. Online Store",
    required: true,
  },
];

const selectFields = [
  {
    name: "productCategory",
    label: "Product category",
    required: true,
    options: [
      "Electronics",
      "Fashion",
      "Groceries",
      "Travel",
      "Food & Dining",
      "Entertainment",
      "Healthcare",
      "Other",
    ],
  },
  {
    name: "cardType",
    label: "Card type",
    required: true,
    options: ["Credit", "Debit", "Premium", "Corporate"],
  },
  {
    name: "transactionType",
    label: "Transaction type",
    required: true,
    options: ["Online", "POS", "Contactless", "ATM"],
  },
  {
    name: "deviceType",
    label: "Device type",
    required: true,
    options: ["Mobile", "Desktop", "Tablet", "Unknown device"],
  },
];

export default function FraudDetection() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Clear an old prediction when the transaction changes.
    setResult(null);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      // MOCK PREDICTION CALL — replace with your backend API later.
      const prediction = await mockFraudPrediction(form);
      setResult(prediction);
    } catch {
      setError(
        "Unable to analyze this transaction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setError("");
    setLoading(false);
  };

  return (
    <main className="fraud-page">
      <div className="fraud-shell">
        <header className="fraud-header">
          <div className="fraud-brand">
            <div className="fraud-brand-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
                <path
                  d="m8.5 12 2.3 2.3 4.8-5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="fraud-eyebrow">TRANSACTION INTELLIGENCE</p>
              <h1>Fraud Detection</h1>
            </div>
          </div>

          <span className="fraud-demo-badge">
            <span className="fraud-status-dot" />
            Demo environment
          </span>
        </header>

        <section className="fraud-intro">
          <p className="fraud-kicker">CREDIT CARD SECURITY</p>
          <h2>Analyze a transaction.</h2>
          <p className="fraud-subtitle">
            Enter transaction details to see an illustrative
            fraud-risk assessment.
          </p>
        </section>

        <div className="fraud-demo-notice" role="note">
          <span className="fraud-notice-icon" aria-hidden="true">
            i
          </span>
          <p>
            <strong>Mock prediction enabled.</strong> This screen
            does not connect to LightGBM. Results are generated
            using illustrative rules and must not be used for
            real financial decisions.
          </p>
        </div>

        <div className="fraud-layout">
          <section className="fraud-card">
            <div className="fraud-card-heading">
              <div>
                <span className="fraud-section-number">01</span>
                <h3>Transaction details</h3>
                <p>Provide the available transaction attributes.</p>
              </div>
              <span className="fraud-required-note">
                * Required
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fraud-form-grid">
                {fields.map((field) => (
                  <div
                    className="fraud-field"
                    key={field.name}
                  >
                    <label htmlFor={field.name}>
                      {field.label}
                      {field.required && (
                        <span className="fraud-required">*</span>
                      )}
                    </label>

                    <div
                      className={
                        field.prefix
                          ? "fraud-input-wrap has-prefix"
                          : "fraud-input-wrap"
                      }
                    >
                      {field.prefix && (
                        <span className="fraud-input-prefix">
                          {field.prefix}
                        </span>
                      )}
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={form[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.min}
                        step={field.step}
                        autoComplete="off"
                      />
                    </div>

                    {field.hint && (
                      <span className="fraud-field-hint">
                        {field.hint}
                      </span>
                    )}
                  </div>
                ))}

                {selectFields.map((field) => (
                  <div
                    className="fraud-field"
                    key={field.name}
                  >
                    <label htmlFor={field.name}>
                      {field.label}
                      {field.required && (
                        <span className="fraud-required">*</span>
                      )}
                    </label>

                    <div className="fraud-input-wrap">
                      <select
                        id={field.name}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required={field.required}
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                <div className="fraud-field fraud-field-full">
                  <label htmlFor="emailDomain">
                    Customer email domain
                    <span className="fraud-required">*</span>
                  </label>
                  <div className="fraud-input-wrap">
                    <input
                      id="emailDomain"
                      name="emailDomain"
                      type="text"
                      value={form.emailDomain}
                      onChange={handleChange}
                      placeholder="e.g. gmail.com"
                      autoComplete="off"
                      pattern="[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?"
                      title="Enter a domain such as gmail.com"
                      required
                    />
                  </div>
                  <span className="fraud-field-hint">
                    Enter the domain only, not the full email address.
                  </span>
                </div>

                <div className="fraud-field">
                  <label htmlFor="country">
                    Transaction country
                    <span className="fraud-required">*</span>
                  </label>
                  <div className="fraud-input-wrap">
                    <select
                      id="country"
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a country</option>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="fraud-error" role="alert">
                  <strong>Analysis failed</strong>
                  <p>{error}</p>
                </div>
              )}

              <div className="fraud-form-actions">
                <button
                  type="button"
                  className="fraud-reset-button"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset form
                </button>

                <button
                  type="submit"
                  className="fraud-submit-button"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="fraud-spinner" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Check for Fraud
                      <span aria-hidden="true">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="fraud-result-card" aria-live="polite">
            <div className="fraud-result-top">
              <div className="fraud-result-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 19V5m0 14h16M8 15l3-4 3 2 5-7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="fraud-result-label">
                ANALYSIS REPORT
              </span>
            </div>

            <h3>Prediction result</h3>
            <p className="fraud-result-description">
              Your transaction assessment will appear here.
            </p>

            {loading ? (
              <div className="fraud-result-state" role="status">
                <span className="fraud-large-spinner" />
                <h4>Analyzing transaction</h4>
                <p>Running the illustrative demo rules...</p>
              </div>
            ) : result ? (
              <div
                className={`fraud-prediction ${
                  result.prediction === "Fraud"
                    ? "is-fraud"
                    : "is-legitimate"
                }`}
              >
                <div className="fraud-prediction-label">
                  <span className="fraud-result-dot" />
                  DEMO CLASSIFICATION
                </div>

                <div className="fraud-prediction-value">
                  {result.prediction}
                </div>

                <div className="fraud-score-heading">
                  <span>Placeholder risk score</span>
                  <strong>{result.riskScore}/100</strong>
                </div>

                <div
                  className="fraud-score-track"
                  role="img"
                  aria-label={`Illustrative risk score ${result.riskScore} out of 100`}
                >
                  <div
                    className="fraud-score-fill"
                    style={{ width: `${result.riskScore}%` }}
                  />
                </div>

                <p className="fraud-result-message">
                  {result.message}
                </p>
              </div>
            ) : (
              <div className="fraud-empty-state">
                <div className="fraud-empty-graphic">
                  <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="12"
                      y="8"
                      width="40"
                      height="48"
                      rx="7"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M22 22h20M22 30h12M22 40l6 6 13-14"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h4>Ready to analyze</h4>
                <p>
                  Complete the required fields and select{" "}
                  <strong>Check for Fraud</strong> to generate a
                  demo prediction.
                </p>
              </div>
            )}

            <div className="fraud-result-footer">
              <span className="fraud-footer-icon">i</span>
              <p>
                The score is illustrative, not a calibrated
                probability. Actual fraud detection requires a
                validated, connected model.
              </p>
            </div>
          </aside>
        </div>

        <footer className="fraud-page-footer">
          <span>Credit Card Fraud Detection</span>
          <span>
            <span className="fraud-footer-status" />
            Mock engine · LightGBM not connected
          </span>
        </footer>
      </div>
    </main>
  );
}
