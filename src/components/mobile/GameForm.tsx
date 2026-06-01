import { useState } from 'react';
import type { GameRecord, Rank, Rule, Room, RankTier } from '../../types';
import { PlusCircle } from 'lucide-react';

type Props = {
  onAdd: (record: GameRecord) => void;
  currentRank: RankTier; 
};

export function GameForm({ onAdd, currentRank }: Props) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [rank, setRank] = useState<Rank | null>(null);
  const [finalScore, setFinalScore] = useState<number>(25000);
  const [rule, setRule] = useState<Rule | ''>('');
  const [room, setRoom] = useState<Room | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rule || !room || rank === null) return;
    const newRecord: GameRecord = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date,
      rank,
      finalScore,
      rule: rule as Rule,
      room: room as Room,
      startRank: currentRank,
      pointChanged: 0,
      endRank: currentRank,
      endRankPt: 0
    };
    onAdd(newRecord);
    setFinalScore(25000);
    setRank(null);
    setRule('');
    setRoom('');
  };

  return (
    <div className="bg-surface p-6 sm:p-8 rounded-3xl shadow-xl border border-border relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-primary/10 transition-all duration-500"></div>
      
      <h2 className="text-2xl font-bold mb-8 text-primary flex items-center gap-2 relative z-10">
        対局結果の登録
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">日付</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              required 
              className="w-full bg-background border border-border rounded-xl p-4 text-lg text-textMain focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer box-border" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">順位</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(r => {
                const colors = {
                  1: 'bg-amber-400/20 text-amber-700 border-amber-400/50 shadow-amber-400/10',
                  2: 'bg-slate-400/20 text-slate-700 border-slate-400/50 shadow-slate-400/10',
                  3: 'bg-orange-400/20 text-orange-700 border-orange-400/50 shadow-orange-400/10',
                  4: 'bg-slate-600/20 text-slate-700 border-slate-600/50 shadow-slate-600/10'
                };
                const active = rank === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRank(r as Rank)}
                    className={`py-4 rounded-xl font-black text-xl transition-all border-2 backdrop-blur-sm ${
                      active 
                        ? `${colors[r as keyof typeof colors]} shadow-lg transform scale-[1.05]` 
                        : 'bg-background/50 border-border text-textMuted hover:border-primary/50'
                    }`}
                  >
                    {r}位
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-textMuted mb-2">終局点数</label>
          <div className="relative">
            <input 
              type="number" 
              step="100" 
              value={finalScore} 
              onChange={e => setFinalScore(Number(e.target.value))} 
              required 
              className="w-full bg-background border border-border rounded-xl p-5 text-3xl font-bold text-textMain focus:ring-2 focus:ring-primary focus:outline-none transition-all tracking-wider selection:bg-primary/30 box-border" 
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-textMuted font-bold text-xl pointer-events-none">点</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">ルール</label>
            <select 
              value={rule} 
              onChange={e => setRule(e.target.value as Rule)} 
              required
              className={`w-full border-2 rounded-xl p-4 text-lg font-black focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer box-border backdrop-blur-sm ${
                rule === '東風' ? 'bg-orange-500/10 text-orange-600 border-orange-500/40' : 
                rule === '東南' ? 'bg-blue-600/10 text-blue-600 border-blue-600/40' : 
                'bg-background/50 border-border text-textMuted'
              }`}
            >
              <option value="" disabled className="text-textMuted">― ルール選択 ―</option>
              <option value="東風" className="text-orange-500 font-bold">東風</option>
              <option value="東南" className="text-blue-500 font-bold">東南（半荘）</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">部屋</label>
            <select 
              value={room} 
              onChange={e => setRoom(e.target.value as Room)} 
              required
              className={`w-full border-2 rounded-xl p-4 text-lg font-black focus:ring-2 focus:ring-primary focus:outline-none transition-all cursor-pointer box-border backdrop-blur-sm ${
                room === '玉の間' ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/40' : 
                room === '王座の間' ? 'bg-amber-500/10 text-amber-600 border-amber-500/40' : 
                'bg-background/50 border-border text-textMuted'
              }`}
            >
              <option value="" disabled className="text-textMuted">― 部屋選択 ―</option>
              <option value="玉の間" className="text-emerald-600 font-bold">玉の間</option>
              <option value="王座の間" className="text-amber-500 font-bold">王座の間</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:from-primaryHover hover:to-secondary text-white font-bold py-5 text-xl rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-1"
        >
          <PlusCircle size={24} />
          登録する
        </button>
      </form>
    </div>
  );
}
