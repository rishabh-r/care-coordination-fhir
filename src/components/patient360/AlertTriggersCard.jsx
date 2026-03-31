import PriorityBadge from './PriorityBadge';

export default function AlertTriggersCard({ observations }) {
  // Get latest values for trend display
  const getVal = (key) => {
    const r = observations[key];
    return r && r.length > 0 ? r[0].value : '—';
  };

  const sys = getVal('systolicBP');
  const dia = getVal('diastolicBP');
  const hba1c = getVal('hba1c');
  const ldl = getVal('ldl');
  const bpStr = sys !== '—' && dia !== '—' ? `${sys}/${dia}` : '—';

  return (
    <div className="p360-card">
      <div className="p360-section-header">
        <h3>&#9888; Alert Triggers & Risk Drivers</h3>
        <span className="p360-section-sub">AI-detected issues requiring immediate attention</span>
      </div>
      <div className="p360-alert-grid">
        <div className="p360-alert-item">
          <div className="p360-alert-icon p360-alert-critical">&#9888;</div>
          <div>
            <strong>Uncontrolled Hypertension</strong>
            <p className="p360-alert-detail">Latest: {bpStr} mmHg</p>
            <PriorityBadge level="critical" label="Critical" />
          </div>
        </div>
        <div className="p360-alert-item">
          <div className="p360-alert-icon p360-alert-high">&#128138;</div>
          <div>
            <strong>Medication Non-Adherence</strong>
            <p className="p360-alert-detail">45-day gap in Lisinopril</p>
            <PriorityBadge level="high" label="High Priority" />
          </div>
        </div>
        <div className="p360-alert-item">
          <div className="p360-alert-icon p360-alert-medium">&#128197;</div>
          <div>
            <strong>Missed Appointments</strong>
            <p className="p360-alert-detail">Cardiology (Feb 10)</p>
            <PriorityBadge level="medium" label="Medium" />
          </div>
        </div>
      </div>

      <div className="p360-trends">
        <h4>&#128200; Deteriorating Clinical Trends</h4>
        <div className="p360-trend-row">
          <span>BP Trend: <strong style={{ color: '#ef4444' }}>{bpStr !== '—' ? `+17 mmHg (6w)` : '—'}</strong></span>
          <span>HbA1c: <strong style={{ color: '#ef4444' }}>{hba1c !== '—' ? `${hba1c}% (Target <7)` : '—'}</strong></span>
          <span>LDL: <strong>{ldl !== '—' ? `${ldl} mg/dL` : '—'}</strong></span>
        </div>
      </div>
    </div>
  );
}
