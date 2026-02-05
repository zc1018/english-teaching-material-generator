import { LEARNING_GOALS } from '../../constants/config';

export default function GoalsCheckbox({ value, onChange }) {
  const handleToggle = (goal) => {
    if (value.includes(goal)) {
      onChange(value.filter(g => g !== goal));
    } else {
      onChange([...value, goal]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        学习目标 (可多选)
      </label>
      <div className="grid grid-cols-2 gap-3">
        {LEARNING_GOALS.map(goal => {
          const isSelected = value.includes(goal.value);
          return (
            <button
              key={goal.value}
              onClick={() => handleToggle(goal.value)}
              className={`
                p-5 rounded-2xl border-2 transition-all text-left
                ${isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-sm ring-1 ring-primary-500'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{goal.icon}</span>
                <span className={`font-bold transition-colors ${isSelected ? 'text-primary-700' : 'text-slate-700'}`}>{goal.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
