const TEAM = [
  { initials: 'DMC', name: 'Dr. Michael Chen', role: 'Primary Care Physician', dept: 'Internal Medicine', primary: true },
  { initials: 'ED', name: 'Emily Davis', role: 'Nurse Practitioner', dept: 'Family Medicine' },
  { initials: 'JS', name: 'Jane Smith', role: 'Care Coordinator', dept: '' },
  { initials: 'DRW', name: 'Dr. Robert Williams', role: 'Endocrinologist', dept: 'Diabetes Management' },
];

export default function CareTeamCard() {
  return (
    <div className="p360-card p360-sidebar-card">
      <div className="p360-section-header">
        <h3>&#128101; Care Team</h3>
        <span className="p360-section-sub">{TEAM.length} members involved</span>
      </div>
      <div className="p360-team-list">
        {TEAM.map((m, i) => (
          <div key={i} className="p360-team-item">
            <div className="p360-team-avatar">{m.initials}</div>
            <div className="p360-team-info">
              <div className="p360-team-name-row">
                <strong>{m.name}</strong>
                {m.primary && <span className="p360-primary-badge">Primary</span>}
              </div>
              <p>{m.role}</p>
              {m.dept && <p className="p360-team-dept">{m.dept}</p>}
            </div>
            <div className="p360-team-actions">
              <button className="p360-icon-btn" title="Call">&#9742;</button>
              <button className="p360-icon-btn" title="Email">&#9993;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
