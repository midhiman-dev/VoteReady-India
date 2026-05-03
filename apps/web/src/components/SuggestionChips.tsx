import React from 'react';

interface SuggestionChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
  label?: string;
  className?: string;
  groupLabel?: string;
}

export default function SuggestionChips({
  chips,
  onChipClick,
  label,
  className = '',
  groupLabel = 'Suggested questions',
}: SuggestionChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className={className}>
      {label && <p className="suggested-label">{label}</p>}
      <div className="suggestion-chips" role="group" aria-label={groupLabel}>
        {chips.map(chip => (
          <button
            key={chip}
            type="button"
            className="suggestion-chip"
            onClick={() => onChipClick(chip)}
            aria-label={`Ask: ${chip}`}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}
