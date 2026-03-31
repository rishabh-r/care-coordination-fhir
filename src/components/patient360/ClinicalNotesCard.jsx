const NOTES = [
  {
    provider: 'Dr. Michael Chen',
    role: 'Primary Care Physician',
    type: 'Clinical',
    date: 'Jan 28, 2026 \u2022 2:15 PM',
    text: 'Patient reports improved energy levels since starting new medication regimen. Blood pressure slightly elevated, will monitor closely. Discussed importance of dietary modifications and regular exercise.',
  },
  {
    provider: 'Jane Smith, RN',
    role: 'Care Coordinator',
    type: 'Coordination',
    date: 'Jan 27, 2026 \u2022 11:30 AM',
    text: 'Coordinated with patient\'s pharmacy to set up automatic prescription refills. Scheduled follow-up appointment for February. Patient expressed concerns about transportation to appointments - referred to community transport services.',
  },
  {
    provider: 'Emily Davis, NP',
    role: 'Nurse Practitioner',
    type: 'Clinical',
    date: 'Jan 25, 2026 \u2022 9:45 AM',
    text: 'Completed telehealth check-in. Patient demonstrates good understanding of medication schedule. Blood glucose logs show improvement over past two weeks. Encouraged to continue current care plan.',
  },
];

export default function ClinicalNotesCard() {
  return (
    <div className="p360-card p360-sidebar-card">
      <div className="p360-section-header">
        <div>
          <h3>Clinical Notes</h3>
          <span className="p360-section-sub">{NOTES.length} TOTAL ENTRIES</span>
        </div>
        <button className="p360-add-note-btn">&#128221; Add Note</button>
      </div>
      <div className="p360-notes-tabs">
        <button className="p360-tab active">All ({NOTES.length})</button>
        <button className="p360-tab">Clinic (2)</button>
        <button className="p360-tab">Care (1)</button>
        <button className="p360-tab">Admin (0)</button>
      </div>
      <div className="p360-notes-list">
        {NOTES.map((note, i) => (
          <div key={i} className="p360-note-item">
            <div className="p360-note-header">
              <div className="p360-note-icon">&#128196;</div>
              <div>
                <strong>{note.provider}</strong>
                <p>{note.role}</p>
              </div>
              <div className="p360-note-actions">
                <span className={`p360-note-type ${note.type === 'Clinical' ? 'p360-note-clinical' : 'p360-note-coord'}`}>{note.type}</span>
                <button className="p360-view-btn">View</button>
              </div>
            </div>
            <p className="p360-note-text">{note.text}</p>
            <p className="p360-note-date">&#128339; {note.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
