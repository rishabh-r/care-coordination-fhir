export default function MedicationsSection({ medications }) {
  const active = medications.filter(m => m.status === 'active');

  return (
    <div className="p360-card">
      <div className="p360-section-header">
        <h3>Current Medications</h3>
        <span className="p360-section-sub">{active.length} active prescription{active.length !== 1 ? 's' : ''}</span>
      </div>
      {active.length === 0 ? (
        <p className="p360-empty">No active medications found.</p>
      ) : (
        <div className="p360-med-list">
          {active.map((med, i) => (
            <div key={i} className="p360-med-item">
              <div className="p360-med-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" width="20" height="20">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div className="p360-med-info">
                <div className="p360-med-name-row">
                  <strong>{med.name}</strong>
                  <span className="p360-status-badge p360-status-active">Active</span>
                </div>
                <p className="p360-med-detail">{med.dosage || 'No dosage info'}</p>
                <p className="p360-med-detail">{med.prescriber || 'Unknown prescriber'} &middot; Started {med.authoredOn || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
