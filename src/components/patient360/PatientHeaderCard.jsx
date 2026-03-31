import PriorityBadge from './PriorityBadge';

export default function PatientHeaderCard({ patient, conditions }) {
  if (!patient) return null;

  const activeConditions = conditions.filter(c => c.clinicalStatus === 'active');
  const programs = activeConditions.slice(0, 3).map(c => c.name).join(', ');

  return (
    <div className="p360-card p360-header-card">
      <div className="p360-header-top">
        <div className="p360-header-left">
          <div className="p360-avatar">{patient.initials}</div>
          <div className="p360-header-info">
            <div className="p360-header-name-row">
              <h2 className="p360-patient-name">{patient.fullName}</h2>
              <PriorityBadge level="high" label="High Priority" />
              <PriorityBadge level="medium" label="Care Gap" />
            </div>
            <p className="p360-demo-line">
              {patient.age ? `${patient.age} yrs` : ''} &middot; {patient.gender} &middot; MRN: MRN-{patient.mrn} &middot; Programs: {programs || 'N/A'} &middot; Score: 32% ASCVD
            </p>
          </div>
        </div>
        <div className="p360-header-actions">
          <button className="p360-action-pill"><span className="p360-action-icon">&#9825;</span> Vitals</button>
          <button className="p360-action-pill"><span className="p360-action-icon">&#8478;</span> Medications</button>
          <button className="p360-action-pill"><span className="p360-action-icon">&#128197;</span> Appointments</button>
        </div>
      </div>
      <div className="p360-header-contact">
        <span>&#128197; DOB: {patient.birthDate || 'N/A'}</span>
        <span>&#9742; {patient.phone || 'N/A'}</span>
        <span>&#9993; {patient.email || 'N/A'}</span>
      </div>
    </div>
  );
}
