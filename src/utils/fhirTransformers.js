// LOINC codes for key vitals (multiple codes per vital to handle API variants)
const VITAL_LOINC = {
  '8480-6': 'systolicBP',
  '8462-4': 'diastolicBP',
  '8867-4': 'heartRate',
  '2345-7': 'glucose',
  '8310-5': 'temperature',
  '4548-4': 'hba1c',
  '17856-6': 'hba1c',  // HbA1c alternative code
  '41995-2': 'hba1c',  // HbA1c alternative code
  '2090-9': 'ldl',
  '13457-7': 'ldl',    // LDL alternative code
  '18262-6': 'ldl',    // LDL alternative code
  '718-7': 'hemoglobin',
  '2160-0': 'creatinine',
  '2823-3': 'potassium',
  '2951-2': 'sodium',
};

const VITAL_NORMAL_RANGES = {
  systolicBP:  { low: 90, high: 120, unit: 'mmHg', label: 'Systolic BP' },
  diastolicBP: { low: 60, high: 80, unit: 'mmHg', label: 'Diastolic BP' },
  heartRate:   { low: 60, high: 100, unit: 'bpm', label: 'Heart Rate' },
  glucose:     { low: 70, high: 130, unit: 'mg/dL', label: 'Blood Glucose' },
  temperature: { low: 97, high: 99, unit: '°F', label: 'Temperature' },
  hba1c:       { low: 4.0, high: 5.6, unit: '%', label: 'HbA1c' },
  ldl:         { low: 0, high: 130, unit: 'mg/dL', label: 'LDL Cholesterol' },
};

export { VITAL_NORMAL_RANGES };

export function parsePatientDemographics(bundle) {
  const entries = bundle?.entry || [];
  const resource = entries[0]?.resource;
  if (!resource) return null;

  const given = resource.name?.[0]?.given?.join(' ') || '';
  const family = resource.name?.[0]?.family || '';
  const fullName = [given, family].filter(Boolean).join(' ');

  const birthDate = resource.birthDate || '';
  const ageRaw = birthDate ? Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : null;
  // Guard against future birthdates in test data (negative age) or unrealistic values
  const age = ageRaw !== null && ageRaw >= 0 && ageRaw <= 150 ? ageRaw : null;

  const gender = resource.gender || '';

  // Extract phone and email from telecom
  const telecoms = resource.telecom || [];
  const phone = telecoms.find(t => t.system === 'phone')?.value || '';
  const email = telecoms.find(t => t.system === 'email')?.value || '';

  // MRN from identifier
  const identifiers = resource.identifier || [];
  const mrn = identifiers.find(i => i.type?.coding?.[0]?.code === 'MR')?.value
    || identifiers[0]?.value || resource.id || '';

  return {
    id: resource.id,
    fullName,
    given,
    family,
    birthDate,
    age,
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    phone,
    email,
    mrn,
    initials: (given.charAt(0) + family.charAt(0)).toUpperCase() || 'P',
  };
}

export function parseConditions(bundle) {
  const entries = bundle?.entry || [];
  return entries.map(entry => {
    const r = entry.resource;
    if (!r) return null;
    const rawName = r.code?.coding?.[0]?.display || r.code?.text || '';
    // If name is a pure numeric code (SNOMED stored without display), use text description fallbacks
    const name = rawName && !/^\d+$/.test(rawName.trim()) ? rawName : (r.code?.coding?.[0]?.code ? `Condition (${r.code.coding[0].code})` : 'Unknown');
    return {
      name,
      code: r.code?.coding?.[0]?.code || '',
      system: r.code?.coding?.[0]?.system || '',
      clinicalStatus: r.clinicalStatus?.coding?.[0]?.code || '',
      severity: r.severity?.coding?.[0]?.display || '',
      recordedDate: r.recordedDate || '',
    };
  }).filter(Boolean);
}

export function parseObservations(bundle) {
  const entries = bundle?.entry || [];
  const grouped = {};

  entries.forEach(entry => {
    const r = entry.resource;
    if (!r) return;

    const code = r.code?.coding?.[0]?.code || '';
    const vitalKey = VITAL_LOINC[code];
    const display = r.code?.coding?.[0]?.display || r.code?.text || 'Unknown';

    // Use valueQuantity.value if present, else valueString, else skip
    const rawValue = r.valueQuantity?.value !== undefined ? r.valueQuantity.value : (r.valueString ?? null);
    if (rawValue === null || rawValue === '') return; // skip observations with no value

    const value = String(rawValue);
    const unit = r.valueQuantity?.unit || r.valueQuantity?.code || '';
    const date = r.effectiveDateTime || r.issued || '';
    const interpretation = r.interpretation?.[0]?.coding?.[0]?.display
      || r.interpretation?.[0]?.coding?.[0]?.code || '';

    const reading = { value, unit, date, interpretation, code, display };

    const key = vitalKey || code || display;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(reading);
  });

  // Sort each group by date descending (latest first)
  Object.values(grouped).forEach(arr => {
    arr.sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  return grouped;
}

export function parseMedications(bundle) {
  const entries = bundle?.entry || [];
  return entries.map(entry => {
    const r = entry.resource;
    if (!r) return null;

    const name = r.medicationCodeableConcept?.coding?.[0]?.display
      || r.medicationCodeableConcept?.text
      || r.medicationReference?.display
      || 'Unknown';
    const code = r.medicationCodeableConcept?.coding?.[0]?.code || '';
    const status = r.status || '';
    const authoredOn = r.authoredOn || '';
    const dosage = r.dosageInstruction?.[0]?.text || '';
    const prescriber = r.requester?.display || '';
    const note = r.note?.[0]?.text || '';

    return { name, code, status, authoredOn, dosage, prescriber, note };
  }).filter(Boolean);
}

export function parseEncounters(bundle) {
  const today = new Date();
  const entries = bundle?.entry || [];

  const parsed = entries.map(entry => {
    const r = entry.resource;
    if (!r) return null;

    const startDate = r.period?.start || '';
    const endDate = r.period?.end || '';
    const classCode = r.class?.code || '';
    const classDisplay = classCode === 'IMP' ? 'Inpatient' : classCode === 'AMB' ? 'Outpatient' : classCode;
    const status = r.status || '';
    const reason = r.reasonCode?.[0]?.coding?.[0]?.display || r.reasonCode?.[0]?.text || '';
    const type = r.type?.[0]?.coding?.[0]?.display || r.type?.[0]?.text || '';
    const provider = r.participant?.[0]?.individual?.display || '';
    const location = r.location?.[0]?.location?.display || '';

    return {
      id: r.id,
      startDate,
      endDate,
      classCode,
      classDisplay,
      status,
      reason: reason || type,
      provider,
      location,
      isUpcoming: startDate ? new Date(startDate) > today : false,
    };
  }).filter(Boolean);

  // Sort by date descending
  parsed.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return {
    upcoming: parsed.filter(e => e.isUpcoming),
    recent: parsed.filter(e => !e.isUpcoming),
    all: parsed,
  };
}
