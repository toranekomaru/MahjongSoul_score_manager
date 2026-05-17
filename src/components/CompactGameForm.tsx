import { useState, useEffect } from 'react';
import type { GameRecord, Rank, Rule, Room, RankTier } from '../types';
import { PlusCircle } from 'lucide-react';

type Props = {
  onAdd: (record: GameRecord) => void;
  currentRank: RankTier;
};

export function CompactGameForm({ onAdd, currentRank }: Props) {
  const now = new Date();
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5)); // HH:mm
  const [isTimeEdited, setIsTimeEdited] = useState(false);
  const [rank, setRank] = useState<Rank | null>(null);
  const [finalScore, setFinalScore] = useState<string>('250'); // 100の位までを入力
  const [rule, setRule] = useState<Rule | ''>('');
  const [room, setRoom] = useState<Room | ''>('');

  // 手動で編集していない場合は、一定間隔で現在時刻に追従させる
  useEffect(() => {
    if (isTimeEdited) return;

    const interval = setInterval(() => {
      const currentNow = new Date();
      setDate(currentNow.toISOString().slice(0, 10));
      setTime(currentNow.toTimeString().slice(0, 5));
    }, 10000); // 10秒ごとに更新

    return () => clearInterval(interval);
  }, [isTimeEdited]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rule || !room || rank === null) return;
    const newRecord: GameRecord = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      date,
      time,
      rank,
      finalScore: (parseFloat(finalScore) || 0) * 100,
      rule: rule as Rule,
      room: room as Room,
      startRank: currentRank,
      pointChanged: 0,
      endRank: currentRank,
      endRankPt: 0,
    };
    onAdd(newRecord);
    
    // 次の入力に備えて点数などをリセットし、日付・時刻も現在時刻＆自動更新モードに戻す
    setFinalScore('250');
    setRank(null);
    setRule('');
    setRoom('');
    setIsTimeEdited(false);
    const updatedNow = new Date();
    setDate(updatedNow.toISOString().slice(0, 10));
    setTime(updatedNow.toTimeString().slice(0, 5));
  };

  const inputCls =
    'bg-background border border-border rounded-lg px-3 py-2 text-textMain text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all';

  return (
    <div className="bg-surface border border-border rounded-2xl px-5 py-4 shadow-lg">
      <h2 className="text-sm font-bold text-primary mb-3">対局結果を記録</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-end gap-3"
      >
        {/* 日付 */}
        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-xs text-textMuted font-medium">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setIsTimeEdited(true);
            }}
            required
            className={`${inputCls} cursor-pointer`}
          />
        </div>

        {/* 時刻 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-textMuted font-medium">時刻</label>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setIsTimeEdited(true);
            }}
            className={`${inputCls} cursor-pointer w-28`}
          />
        </div>

        {/* 部屋 / ルール */}
        <div className="flex flex-col gap-1 min-w-[110px]">
          <label className="text-xs text-textMuted font-medium">部屋 / ルール</label>
          <div className="flex gap-1">
            <select
              value={room}
              onChange={(e) => setRoom(e.target.value as Room)}
              required
              className={`${inputCls} cursor-pointer flex-1 font-bold backdrop-blur-sm ${
                room === '玉の間' ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/40' : 
                room === '王座の間' ? 'bg-amber-500/10 text-amber-600 border-amber-500/40' : 
                'bg-background/50 text-textMuted'
              }`}
            >
              <option value="" disabled className="text-textMuted">― 部屋 ―</option>
              <option value="玉の間" className="bg-surface text-emerald-600 font-bold">玉の間</option>
              <option value="王座の間" className="bg-surface text-amber-500 font-bold">王座の間</option>
            </select>
            <select
              value={rule}
              onChange={(e) => setRule(e.target.value as Rule)}
              required
              className={`${inputCls} cursor-pointer flex-1 font-bold backdrop-blur-sm ${
                rule === '東風' ? 'bg-orange-500/10 text-orange-600 border-orange-500/40' : 
                rule === '東南' ? 'bg-blue-600/10 text-blue-600 border-blue-600/40' : 
                'bg-background/50 text-textMuted'
              }`}
            >
              <option value="" disabled className="text-textMuted">― ルール ―</option>
              <option value="東風" className="bg-surface text-orange-500 font-bold">東風</option>
              <option value="東南" className="bg-surface text-blue-500 font-bold">東南</option>
            </select>
          </div>
        </div>

        {/* 順位ボタン */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-textMuted font-medium">順位</label>
          <div className="flex gap-1">
            {([1, 2, 3, 4] as Rank[]).map((r) => {
              const colors = {
                1: 'bg-amber-400/20 text-amber-700 border-amber-400/50',
                2: 'bg-slate-400/20 text-slate-700 border-slate-400/50',
                3: 'bg-orange-400/20 text-orange-700 border-orange-400/50',
                4: 'bg-slate-600/20 text-slate-700 border-slate-600/50'
              };
              const active = rank === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRank(r)}
                  className={`w-12 py-2 rounded-lg font-bold text-sm transition-all border backdrop-blur-sm ${
                    active
                      ? `${colors[r]} shadow-md scale-105`
                      : 'bg-background/50 border-border text-textMuted hover:border-primary/50'
                  }`}
                >
                  {r}着
                </button>
              );
            })}
          </div>
        </div>

        {/* 最終点数 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-textMuted font-medium">最終点数</label>
          <div className="flex items-center gap-1">
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                value={finalScore}
                onChange={(e) => {
                  // 数字・マイナス記号のみ許可、先頭0を除去
                  const raw = e.target.value.replace(/[^0-9\-]/g, '');
                  const cleaned = raw.replace(/^(-?)0+(\d)/, '$1$2');
                  setFinalScore(cleaned);
                }}
                onFocus={(e) => e.target.select()}
                required
                className={`${inputCls} w-24 pr-7 text-right font-bold text-base tracking-widest`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted font-bold text-base pointer-events-none">
                00
              </span>
            </div>
            <span className="text-xs text-textMuted">点</span>
          </div>
        </div>

        {/* 追加ボタン */}
        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white font-bold px-5 py-2 rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all text-sm whitespace-nowrap"
        >
          <PlusCircle size={16} />
          追加する
        </button>
      </form>
    </div>
  );
}
