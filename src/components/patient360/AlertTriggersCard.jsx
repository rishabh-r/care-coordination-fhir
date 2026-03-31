import PriorityBadge from './PriorityBadge';

export default function AlertTriggersCard({ observations, medications, encounters }) {
  const alerts = [];

  // 1. Hypertension alert — derive from actual BP values
  const sysReadings = observations?.systolicBP || [];
  const diaReadings = observations?.diastolicBP || [];
  const latestSys = sysReadings[0];
  const latestDia = diaReadings[0];
  if (latestSys && latestDia) {
    const sysVal = parseFloat(latestSys.value);
    const diaVal = parseFloat(latestDia.value);
    if (sysVal > 140 || diaVal > 90) {
      alerts.push({
        icon: '\u26A0',
        iconClass: 'p360-alert-critical',
        title: 'Uncontrolled Hypertension',
        detail: `Latest: ${latestSys.value}/${latestDia.value} mmHg`,
        level: 'critical',
        label: 'Critical',
      });
    }
  }

  // 2. Medication non-adherence — find stopped/on-hold meds, deduplicate names
  const gapMeds = (medications || []).filter(m => m.status === 'on-hold' || m.status === 'stopped');
  if (gapMeds.length > 0) {
    const uniqueNames = [...new Set(gapMeds.map(m => m.name).filter(Boolean))];
    const medNames = uniqueNames.slice(0, 3).join(', ');
    const uniqueCount = uniqueNames.length;
    alerts.push({
      icon: '\uD83D\uDC8A',
      iconClass: 'p360-alert-high',
      title: 'Medication Non-Adherence',
      detail: `${uniqueCount} medication(s) stopped/on-hold: ${medNames}`,
      level: 'high',
      label: 'High Priority',
    });
  }

  // 3. Missed appointments — find encounters with NO SHOW (use startDate not date)
  const allEncounters = (encounters?.all || [
    ...(encounters?.upcoming || []),
    ...(encounters?.recent || []),
  ]);
  const missed = allEncounters.filter(e =>
    (e.location || '').toLowerCase().includes('no show') ||
    (e.status || '').toLowerCase() === 'cancelled'
  );
  if (missed.length > 0) {
    const latest = missed[0];
    alerts.push({
      icon: '\uD83D\uDCC5',
      iconClass: 'p360-alert-medium',
      title: 'Missed Appointments',
      detail: `${latest.reason || latest.classDisplay || 'Appointment'} (${latest.startDate || 'N/A'})`,
      level: 'medium',
      label: 'Medium',
    });
  }

  // Compute BP trend from systolic readings
  let bpTrend = null;
  if (sysReadings.length >= 2) {
    const newest = parseFloat(sysReadings[0].value);
    const oldest = parseFloat(sysReadings[sysReadings.length - 1].value);
    const diff = newest - oldest;
    if (!isNaN(diff) && diff !== 0) {
      bpTrend = { diff, direction: diff > 0 ? 'up' : 'down' };
    }
  }

  const hba1cReadings = observations?.hba1c || [];
  const ldlReadings = observations?.ldl || [];
  const latestHba1c = hba1cReadings[0];
  const latestLdl = ldlReadings[0];

  const bpStr = latestSys && latestDia ? `${latestSys.value}/${latestDia.value}` : '—';

  return (
    <div className="p360-card">
      <div className="p360-section-header">
        <h3>&#9888; Alert Triggers & Risk Drivers</h3>
        <span className="p360-section-sub">AI-detected issues requiring immediate attention</span>
      </div>

      {alerts.length === 0 ? (
        <p style={{ padding: '16px', color: '#64748b' }}>No active alerts detected.</p>
      ) : (
        <div className="p360-alert-grid">
          {alerts.map((alert, i) => (
            <div key={i} className="p360-alert-item">
              <div className={`p360-alert-icon ${alert.iconClass}`}>{alert.icon}</div>
              <div>
                <strong>{alert.title}</strong>
                <p className="p360-alert-detail">{alert.detail}</p>
                <PriorityBadge level={alert.level} label={alert.label} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="p360-trends">
        <h4>&#128200; Clinical Trends</h4>
        <div className="p360-trend-row">
          <span>BP Trend: <strong style={{ color: bpTrend && bpTrend.diff > 0 ? '#ef4444' : '#22c55e' }}>
            {bpTrend ? `${bpTrend.diff > 0 ? '+' : ''}${bpTrend.diff} mmHg` : bpStr !== '—' ? bpStr + ' mmHg' : '—'}
          </strong></span>
          <span>HbA1c: <strong style={{ color: latestHba1c?.value && parseFloat(latestHba1c.value) >= 7 ? '#ef4444' : '#1e293b' }}>
            {latestHba1c?.value ? `${latestHba1c.value}% (Target <7)` : '—'}
          </strong></span>
          <span>LDL: <strong>
            {latestLdl ? `${latestLdl.value} mg/dL` : '—'}
          </strong></span>
        </div>
      </div>
    </div>
  );
}
