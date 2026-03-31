import { VITAL_NORMAL_RANGES } from '../../utils/fhirTransformers';

function VitalCard({ label, value, unit, normalLow, normalHigh, normalLabel }) {
  const numVal = parseFloat(value);
  const isAbove = !isNaN(numVal) && numVal > normalHigh;
  const isBelow = !isNaN(numVal) && numVal < normalLow;
  const isNormal = !isAbove && !isBelow;
  const barColor = isNormal ? '#22c55e' : '#ef4444';

  // Percentage for the bar (clamped to 0-100)
  const range = normalHigh - normalLow;
  const pct = !isNaN(numVal) ? Math.min(100, Math.max(5, ((numVal - normalLow + range * 0.3) / (range * 1.6)) * 100)) : 50;

  return (
    <div className="p360-vital-card">
      <div className="p360-vital-header">
        <span className="p360-vital-label">{label}</span>
        <span className="p360-vital-normal">Normal<br />{normalLabel}</span>
      </div>
      <div className="p360-vital-value" style={{ color: isNormal ? '#1e293b' : '#ef4444' }}>
        {value !== '' && value !== undefined ? value : '—'} <span className="p360-vital-unit">{unit}</span>
      </div>
      <div className="p360-vital-bar-bg">
        <div className="p360-vital-bar" style={{ width: `${pct}%`, background: barColor }}></div>
      </div>
    </div>
  );
}

export default function VitalsSection({ observations }) {
  const getLatest = (key) => {
    const readings = observations[key];
    if (!readings || readings.length === 0) return { value: '', unit: '' };
    return readings[0];
  };

  const sys = getLatest('systolicBP');
  const dia = getLatest('diastolicBP');
  const hr = getLatest('heartRate');
  const gluc = getLatest('glucose');
  const temp = getLatest('temperature');

  const bpValue = sys.value && dia.value ? `${sys.value}/${dia.value}` : sys.value || '—';

  return (
    <div className="p360-card">
      <div className="p360-section-header">
        <h3>Vitals</h3>
        <span className="p360-section-sub">Last updated: Today, 9:30 AM</span>
      </div>
      <div className="p360-vitals-grid">
        <VitalCard label="Blood Pressure" value={bpValue} unit="mmHg" normalLow={90} normalHigh={120} normalLabel="120/80" />
        <VitalCard label="Heart Rate" value={hr.value} unit={hr.unit || 'bpm'} normalLow={60} normalHigh={100} normalLabel="60-100" />
        <VitalCard label="Blood Glucose" value={gluc.value} unit={gluc.unit || 'mg/dL'} normalLow={70} normalHigh={130} normalLabel="70-130" />
        <VitalCard label="Temperature" value={temp.value} unit={temp.unit || '°F'} normalLow={97} normalHigh={99} normalLabel="97-99" />
      </div>
    </div>
  );
}
