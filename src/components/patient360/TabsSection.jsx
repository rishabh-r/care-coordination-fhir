import { useState } from 'react';
import PriorityBadge from './PriorityBadge';

const AI_ACTIONS = [
  {
    title: 'Urgent Patient Outreach - Phone Call',
    priority: 'high',
    timeframe: 'Within 24 hours',
    desc: 'Contact patient within 24 hours to discuss medication adherence and appointment no-shows',
    rationale: 'Multiple care gaps detected including 45-day medication gap and missed cardiology appointment',
  },
  {
    title: 'Medication Reconciliation',
    priority: 'high',
    timeframe: 'Within 48 hours',
    desc: 'Review current medications, identify barriers to adherence, discuss pharmacy access',
    rationale: 'Lisinopril and Metformin gaps exceed 30 days, contributing to deteriorating vitals',
  },
  {
    title: 'Reschedule Cardiology Appointment',
    priority: 'medium',
    timeframe: 'Within 1 week',
    desc: 'Schedule follow-up cardiology appointment and address barriers to attendance',
    rationale: 'Missed appointment on Feb 10, 2026. Critical for managing uncontrolled hypertension.',
  },
  {
    title: 'Send Educational Materials',
    priority: 'medium',
    timeframe: 'Within 48 hours',
    desc: 'Share diabetes and hypertension management resources via patient portal',
    rationale: 'Patient education may improve understanding of medication importance and self-management',
  },
  {
    title: 'Provider Alert',
    priority: 'high',
    timeframe: 'Within 24 hours',
    desc: 'Notify PCP of deteriorating BP trends and medication non-adherence via secure message',
    rationale: 'Provider may need to adjust treatment plan given worsening clinical indicators',
  },
  {
    title: 'Social Determinants Screening',
    priority: 'low',
    timeframe: 'During next contact',
    desc: 'Assess financial, transportation, and social barriers affecting care engagement',
    rationale: 'Multiple missed appointments and medication gaps suggest potential social barriers',
  },
];

const TABS = ['AI Actions', 'Clinical Trends', 'Task Queue', 'Patient Outreach'];

export default function TabsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (i) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  return (
    <div className="p360-card">
      <div className="p360-tabs-bar">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            className={`p360-tab-btn ${i === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {i === 0 && '✨ '}{tab}
          </button>
        ))}
      </div>

      {activeTab === 0 ? (
        <div className="p360-ai-actions">
          <div className="p360-ai-actions-header">
            <div>
              <h3>AI-Recommended Actions</h3>
              <p>Select actions to approve and create tasks ({selected.size} selected)</p>
            </div>
            <button className="p360-approve-btn">&#9989; Approve Selected ({selected.size})</button>
          </div>
          {AI_ACTIONS.map((action, i) => (
            <div key={i} className="p360-action-item">
              <input
                type="checkbox"
                checked={selected.has(i)}
                onChange={() => toggleSelect(i)}
                className="p360-checkbox"
              />
              <div className="p360-action-content">
                <div className="p360-action-title-row">
                  <strong>{action.title}</strong>
                  <PriorityBadge level={action.priority} label={action.priority === 'high' ? 'High Priority' : action.priority === 'medium' ? 'Medium Priority' : 'Low Priority'} />
                  <span className="p360-timeframe">&#9201; {action.timeframe}</span>
                </div>
                <p className="p360-action-desc">{action.desc}</p>
                <div className="p360-action-rationale">
                  <strong>AI RATIONALE:</strong>
                  <p>{action.rationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p360-coming-soon">
          <p>Coming Soon</p>
        </div>
      )}
    </div>
  );
}
