import { useParams, useLocation, useNavigate } from 'react-router-dom';
import usePatientData from '../../hooks/usePatientData';
import PatientHeaderCard from './PatientHeaderCard';
import AlertTriggersCard from './AlertTriggersCard';
import RiskInsightsCard from './RiskInsightsCard';
import CareTeamCard from './CareTeamCard';
import ClinicalNotesCard from './ClinicalNotesCard';
import TabsSection from './TabsSection';
import VitalsSection from './VitalsSection';
import MedicationsSection from './MedicationsSection';
import AppointmentsSection from './AppointmentsSection';
import '../../styles/patient360.css';

export default function Patient360Page() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const careGapAnalysis = location.state?.careGapAnalysis || null;

  const { patient, conditions, observations, medications, encounters, loading, error } = usePatientData(id);

  if (loading) {
    return (
      <div className="patient360">
        <nav className="p360-navbar">
          <img src="/images/LogoRsi.png" alt="R Systems" className="p360-nav-logo" />
          <span className="p360-nav-title">Patient 360 Portal</span>
          <div className="p360-nav-right">
            <span className="p360-nav-links">Care Manager &nbsp; Provider &nbsp; Patients</span>
          </div>
        </nav>
        <div className="p360-loading">
          <div className="spinner-dark"></div>
          <p>Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient360">
        <nav className="p360-navbar">
          <img src="/images/LogoRsi.png" alt="R Systems" className="p360-nav-logo" />
          <span className="p360-nav-title">Patient 360 Portal</span>
        </nav>
        <div className="p360-loading">
          <p style={{ color: '#ef4444' }}>Error loading patient data: {error}</p>
          <button onClick={() => navigate('/')} className="p360-back-link">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="patient360">
      {/* Navbar */}
      <nav className="p360-navbar">
        <img src="/images/LogoRsi.png" alt="R Systems" className="p360-nav-logo" />
        <span className="p360-nav-title">Patient 360 Portal</span>
        <div className="p360-nav-right">
          <span className="p360-nav-links">Care Manager &nbsp; Provider &nbsp; Patients</span>
          <div className="p360-nav-user">
            <span>Mark Miller</span>
            <small>ADMIN</small>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="p360-breadcrumb">
        <button onClick={() => navigate('/')} className="p360-back-link">&larr; Care Manager Dashboard</button>
        <span>&gt;</span>
        <span className="p360-breadcrumb-name">{patient?.fullName || 'Patient'}</span>
        <span className="p360-breadcrumb-sub">Patient Profile & Care Management</span>
      </div>

      {/* Main grid layout */}
      <div className="p360-grid">
        {/* Left column (main content) */}
        <div className="p360-main">
          <PatientHeaderCard patient={patient} conditions={conditions} medications={medications} observations={observations} />
          <AlertTriggersCard observations={observations} medications={medications} encounters={encounters} />
          <TabsSection />
          <VitalsSection observations={observations} />
          <MedicationsSection medications={medications} />
          <AppointmentsSection encounters={encounters} />
        </div>

        {/* Right column (sidebar) */}
        <div className="p360-sidebar">
          <RiskInsightsCard />
          <CareTeamCard />
          <ClinicalNotesCard />
        </div>
      </div>
    </div>
  );
}
