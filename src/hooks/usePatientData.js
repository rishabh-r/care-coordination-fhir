import { useState, useEffect } from 'react';
import { executeTool } from '../services/fhirApi';
import {
  parsePatientDemographics,
  parseConditions,
  parseObservations,
  parseMedications,
  parseEncounters,
} from '../utils/fhirTransformers';

export default function usePatientData(patientId) {
  const [data, setData] = useState({
    patient: null,
    conditions: [],
    observations: {},
    medications: [],
    encounters: { upcoming: [], recent: [], all: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      setError('No patient ID provided');
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      try {
        const [patientRes, conditionRes, observationRes, medicationRes, encounterRes] = await Promise.all([
          executeTool('search_fhir_patient', { PATIENT_ID: patientId }),
          executeTool('search_patient_condition', { SUBJECT: patientId }),
          executeTool('search_patient_observations', { SUBJECT: patientId }),
          executeTool('search_patient_medications', { SUBJECT: patientId }),
          executeTool('search_patient_encounter', { SUBJECT: patientId }),
        ]);

        if (cancelled) return;

        setData({
          patient: parsePatientDemographics(patientRes.result),
          conditions: parseConditions(conditionRes.result),
          observations: parseObservations(observationRes.result),
          medications: parseMedications(medicationRes.result),
          encounters: parseEncounters(encounterRes.result),
        });
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [patientId]);

  return { ...data, loading, error };
}
