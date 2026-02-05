import LevelSelector from './LevelSelector';
import VocabRangeSlider from './VocabRangeSlider';
import GoalsCheckbox from './GoalsCheckbox';
import ToggleGroup from './ToggleGroup';
import { OUTPUT_LANGUAGES, SUBTITLE_FORMATS, OUTPUT_STYLES } from '../../constants/config';

export default function ConfigPanel({ config, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-8">
      <LevelSelector
        value={config.level}
        onChange={(value) => handleChange('level', value)}
      />

      <VocabRangeSlider
        value={config.vocabRange}
        onChange={(value) => handleChange('vocabRange', value)}
      />

      <GoalsCheckbox
        value={config.goals}
        onChange={(value) => handleChange('goals', value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ToggleGroup
          label="输出语言"
          options={OUTPUT_LANGUAGES}
          value={config.outputLanguage}
          onChange={(value) => handleChange('outputLanguage', value)}
        />

        <ToggleGroup
          label="字幕格式"
          options={SUBTITLE_FORMATS}
          value={config.subtitleFormat}
          onChange={(value) => handleChange('subtitleFormat', value)}
        />

        <ToggleGroup
          label="输出风格"
          options={OUTPUT_STYLES}
          value={config.style}
          onChange={(value) => handleChange('style', value)}
        />
      </div>
    </div>
  );
}
