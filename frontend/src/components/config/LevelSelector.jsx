import { LEVELS } from '../../constants/config';

export default function LevelSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        难度级别
      </label>
      <div className="grid grid-cols-3 gap-3">
        {LEVELS.map(level => (
          <button
            key={level.value}
            onClick={() => onChange(level.value)}
            className={`
              p-5 rounded-2xl border-2 transition-all text-left group
              ${value === level.value
                ? 'border-primary-500 bg-primary-50 shadow-sm ring-1 ring-primary-500'
                : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
              }
            `}
          >
            <div className={`font-black text-xl mb-1 transition-colors ${value === level.value ? 'text-primary-700' : 'text-slate-900'}`}>{level.value}</div>
            <div className="text-xs font-semibold text-slate-500">{level.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
