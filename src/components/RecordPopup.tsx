import React from "react";
import { TrainingRecord } from "@/types/training-record";
import { formatDateDisplay } from "@/utils/calendar";

interface RecordPopupProps {
  date: Date;
  records: TrainingRecord[];
  onClose: () => void;
}

/**
 * トレーニング記録詳細を表示するポップアップコンポーネント
 */
export const RecordPopup: React.FC<RecordPopupProps> = ({
  date,
  records,
  onClose,
}) => {
  // オーバーレイクリックで閉じる
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 同一メニューを集計 (メニューID単位で set を合計)
  const aggregated = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string; total: number }>();
    for (const r of records) {
      const key = r.training_menu_id;
      const existing = map.get(key);
      const name = r.training_menus?.name || "不明";
      if (existing) {
        existing.total += r.set;
      } else {
        map.set(key, { id: key, name, total: r.set });
      }
    }
    // 安定した表示のためメニュー名でソート
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "ja")
    );
  }, [records]);

  return (
    <div className="record-popup-overlay" onClick={handleOverlayClick}>
      <div className="record-popup" role="dialog" aria-labelledby="popup-title">
        <div className="record-popup-header">
          <h3 id="popup-title">{formatDateDisplay(date)}</h3>
          <button
            className="record-popup-close pure-button"
            onClick={onClose}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className="record-popup-content">
          <ul className="record-popup-list">
            {aggregated.map((item) => (
              <li key={item.id} className="record-popup-item">
                <span className="record-popup-menu">{item.name}</span>
                <span className="record-popup-count">{item.total}セット</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="record-popup-footer">
          <button className="pure-button" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordPopup;
