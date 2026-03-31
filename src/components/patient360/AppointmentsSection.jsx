export default function AppointmentsSection({ encounters }) {
  const { upcoming, recent } = encounters;
  const display = [...upcoming.slice(0, 3), ...recent.slice(0, 3)];

  return (
    <div className="p360-card">
      <div className="p360-section-header">
        <h3>Appointments</h3>
        <span className="p360-section-sub">Upcoming and recent visits</span>
      </div>
      {display.length === 0 ? (
        <p className="p360-empty">No appointments found.</p>
      ) : (
        <div className="p360-appt-list">
          {display.map((enc, i) => {
            const isUp = enc.isUpcoming;
            return (
              <div key={i} className="p360-appt-item">
                <div className="p360-appt-info">
                  <div className="p360-appt-name-row">
                    <strong>{enc.reason || enc.classDisplay || 'Encounter'}</strong>
                    <span className={`p360-status-badge ${isUp ? 'p360-status-upcoming' : enc.status === 'finished' ? 'p360-status-completed' : 'p360-status-default'}`}>
                      {isUp ? 'Upcoming' : enc.status === 'finished' ? 'Completed' : enc.status}
                    </span>
                    {enc.classDisplay === 'Outpatient' && <span className="p360-status-badge p360-status-default">{enc.classDisplay}</span>}
                  </div>
                  <p className="p360-appt-detail">with {enc.provider || 'Provider N/A'}</p>
                  <p className="p360-appt-detail">
                    &#128197; {enc.startDate || 'N/A'}
                    {enc.location && <> &middot; &#128205; {enc.location}</>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
