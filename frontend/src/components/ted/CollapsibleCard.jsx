import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CollapsibleCard({ title, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="collapsible-card">
      <div
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{title}</h3>
        <ChevronDown
          className={`collapsible-icon ${isOpen ? 'open' : ''}`}
          size={24}
        />
      </div>

      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
}
