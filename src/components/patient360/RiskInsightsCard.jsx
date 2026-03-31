function RiskRow({ label, value, level, color }) {
  return (
    <div className="p360-risk-row">
      <div className="p360-risk-label">
        <span>{label}</span>
        <span className={`p360-risk-level p360-risk-${level}`}>{level.toUpperCase()}</span>
      </div>
      <div className="p360-risk-value" style={{ color }}>{value}%</div>
      <div className="p360-risk-bar-bg">
        <div className="p360-risk-bar" style={{ width: `${value}%`, background: color }}></div>
      </div>
    </div>
  );
}

export default function RiskInsightsCard() {
  return (
    <div className="p360-card p360-sidebar-card">
      <div className="p360-section-header">
        <h3>Risk Insights</h3>
        <span className="p360-ai-badge">&#10024; AI Powered</span>
      </div>
      <RiskRow label="Hypertension" value={32.6} level="mod" color="#ea580c" />
      <RiskRow label="Diabetes" value={2.5} level="low" color="#22c55e" />
      <RiskRow label="Cancer" value={5.2} level="low" color="#ef4444" />
    </div>
  );
}
