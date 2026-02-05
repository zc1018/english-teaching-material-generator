export default function ToggleGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="inline-flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-100">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-6 py-2.5 rounded-xl font-bold transition-all text-sm
              ${value === option.value
                ? 'bg-white text-primary-600 shadow-sm shadow-slate-200/50 ring-1 ring-slate-200/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
