import { useState, useEffect } from 'react';
import type { SettingsInfo, RankTier } from '../../types';
import { Save } from 'lucide-react';

type Props = {
  settings: SettingsInfo | null;
  onSave: (s: SettingsInfo) => void;
};

const ranks: RankTier[] = ["雀豪1", "雀豪2", "雀豪3", "雀聖1", "雀聖2", "雀聖3"];

export function Settings({ settings, onSave }: Props) {
  const [initialRank, setInitialRank] = useState<RankTier>("雀豪1");
  const [initialPt, setInitialPt] = useState<number>(1400);

  useEffect(() => {
    if (settings) {
      setInitialRank(settings.initialRank);
      setInitialPt(settings.initialPt);
    }
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: 1, initialRank, initialPt });
  };

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-xl border border-border">
      <h2 className="text-xl font-bold mb-6 text-primary flex items-center gap-2">
        初期設定
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">開始段位</label>
          <select 
            className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            value={initialRank} 
            onChange={e => setInitialRank(e.target.value as RankTier)}
          >
            {ranks.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-textMuted mb-1">開始ポイント</label>
          <input 
            type="number" 
            className="w-full bg-background border border-border rounded-lg p-3 text-textMain focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            value={initialPt} 
            onChange={e => setInitialPt(Number(e.target.value))} 
          />
        </div>
        <button type="submit" className="w-full bg-primary hover:bg-primaryHover text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
          <Save size={18} />
          設定を保存する
        </button>
      </form>
      <p className="mt-4 text-xs text-textMuted">※設定を変更すると、過去の対局結果もこの起点から再計算されます。</p>
    </div>
  );
}
