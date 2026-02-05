import { VOCAB_RANGES } from '../../constants/config';

export default function VocabRangeSlider({ value, onChange }) {
  const currentIndex = VOCAB_RANGES.findIndex(r => r.value === value);

  const handleChange = (e) => {
    const index = parseInt(e.target.value);
    onChange(VOCAB_RANGES[index].value);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        词汇量范围
      </label>
      <div className="px-2">
        <input
          type="range"
          min="0"
          max={VOCAB_RANGES.length - 1}
          value={currentIndex}
          onChange={handleChange}
          className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer
                     accent-primary-500 border-none"
        />
        <div className="flex justify-between mt-3">
          {VOCAB_RANGES.map((range, index) => (
            <span
              key={range.value}
              className={`text-xs font-bold transition-all ${index === currentIndex
                  ? 'text-primary-600'
                  : 'text-slate-400'
                }`}
            >
              {range.label}
            </span>
          ))}
        </div>
      </div>
      <div className="text-center p-4 bg-slate-50 border border-slate-100 rounded-2xl">
        <span className="text-xl font-black text-slate-900 tracking-tight">{value}</span>
      </div>
    </div>
  );
}
