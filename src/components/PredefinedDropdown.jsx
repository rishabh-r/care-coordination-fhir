import { useState, useEffect, useRef } from 'react';

const PREDEFINED_ITEMS = [
  { label: "Search Patient" },
  { label: "View Active Conditions" },
  { label: "View Latest Observations" },
  { label: "View Active Medications" },
  { label: "View Last 12 months encounters" },
  { label: "View Care Gaps" },
];

export default function PredefinedDropdown({ onSelect, disabled }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const bulbRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        bulbRef.current && !bulbRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleItemClick = (label) => {
    if (disabled) return;
    setOpen(false);
    onSelect(label);
  };

  return (
    <>
      <div
        ref={dropdownRef}
        className={`predefined-dropdown${open ? '' : ' hidden'}`}
      >
        {PREDEFINED_ITEMS.map((item) => (
          <div
            key={item.label}
            className="predefined-dropdown-item"
            data-label={item.label}
            onClick={() => handleItemClick(item.label)}
          >
            {item.label}
          </div>
        ))}
      </div>
      <button
        ref={bulbRef}
        className={`bulb-btn${open ? ' active' : ''}`}
        title="Predefined questions"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="9" y1="18" x2="15" y2="18"/>
          <line x1="10" y1="22" x2="14" y2="22"/>
          <path d="M12 2a7 7 0 0 1 7 7c0 3-1.8 5.4-4.5 6.5V17H9.5v-1.5C6.8 14.4 5 12 5 9a7 7 0 0 1 7-7z"/>
        </svg>
      </button>
    </>
  );
}
