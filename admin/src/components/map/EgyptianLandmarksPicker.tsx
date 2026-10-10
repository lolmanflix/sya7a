import React from 'react';
import { Landmark } from 'lucide-react';
import { EgyptianLandmark, OFFLINE_EGYPTIAN_LANDMARKS } from '../../constants/landmarks';
import { useTranslation } from '../../i18n/useTranslation';

interface EgyptianLandmarksPickerProps {
  onSelectLandmark: (landmark: EgyptianLandmark) => void;
}

/**
 * Dropdown picker for preset Egyptian landmarks and transit hubs.
 */
export const EgyptianLandmarksPicker: React.FC<EgyptianLandmarksPickerProps> = ({
  onSelectLandmark,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-1">
      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
        <Landmark className="w-3.5 h-3.5 text-brand-400" />
        {t('map.landmarksPickerLabel')}
      </span>
      <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pe-1">
        {OFFLINE_EGYPTIAN_LANDMARKS.map((lm) => (
          <button
            key={lm.name}
            type="button"
            onClick={() => onSelectLandmark(lm)}
            className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] transition-colors"
          >
            + {lm.name.split('(')[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
};
