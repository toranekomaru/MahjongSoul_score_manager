import { useState, useMemo } from 'react';
import type { GameRecord, Rule } from '../types';

type Props = {
  records: GameRecord[];
};

type PeriodType = 'day' | 'week' | 'month';
type RuleFilter = 'all' | Rule;

function getWeekString(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10) + 'の週';
}

export function PeriodStats({ records }: Props) {
  const [periodType, setPeriodType] = useState<PeriodType>('day');
  const [ruleFilter, setRuleFilter] = useState<RuleFilter>('all');

  const stats = useMemo(() => {
    // 1. ルールでフィルタリング
    const filteredRecords = records.filter(r => ruleFilter === 'all' || r.rule === ruleFilter);

    // 2. 期間ごとにグループ化
    const grouped = filteredRecords.reduce((acc, r) => {
      let key = r.date;
      if (periodType === 'month') {
        key = r.date.slice(0, 7); // YYYY-MM
      } else if (periodType === 'week') {
        key = getWeekString(r.date);
      }

      if (!acc[key]) {
        acc[key] = { count: 0, sumRank: 0, firsts: 0, seconds: 0, thirds: 0, fourths: 0, ptChange: 0 };
      }
      acc[key].count++;
      acc[key].sumRank += r.rank;
      acc[key].ptChange += r.pointChanged;
      if (r.rank === 1) acc[key].firsts++;
      else if (r.rank === 2) acc[key].seconds++;
      else if (r.rank === 3) acc[key].thirds++;
      else if (r.rank === 4) acc[key].fourths++;
      return acc;
    }, {} as Record<string, { count: number; sumRank: number; firsts: number; seconds: number; thirds: number; fourths: number; ptChange: number }>);

    // 3. 配列に変換して並び替え（新しい期間が上）
    return Object.entries(grouped)
      .map(([key, val]) => {
        const avgPtVal = val.ptChange / val.count;
        return {
          key,
          count: val.count,
          avgRank: (val.sumRank / val.count).toFixed(2),
          rankBreakdown: `${val.firsts}-${val.seconds}-${val.thirds}-${val.fourths}`,
          firstRate: ((val.firsts / val.count) * 100).toFixed(1) + '%',
          lastRate: ((val.fourths / val.count) * 100).toFixed(1) + '%',
          totalPt: val.ptChange > 0 ? '+' + val.ptChange : String(val.ptChange),
          avgPt: avgPtVal > 0 ? '+' + avgPtVal.toFixed(1) : avgPtVal.toFixed(1),
        };
      })
      .sort((a, b) => b.key.localeCompare(a.key)); // 降順
  }, [records, periodType, ruleFilter]);

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden h-full">
      {/* ヘッダー・操作パネル */}
      <div className="px-5 py-4 border-b border-border shrink-0 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-base font-bold text-primary">期間別成績</h2>
        
        <div className="flex gap-4">
          {/* 期間選択 */}
          <div className="flex bg-background border border-border rounded-lg p-1">
            {([
              { value: 'day', label: '日別' },
              { value: 'week', label: '週別' },
              { value: 'month', label: '月別' }
            ] as const).map(p => (
              <button
                key={p.value}
                onClick={() => setPeriodType(p.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  periodType === p.value
                    ? 'bg-primary text-white shadow'
                    : 'text-textMuted hover:text-textMain'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* ルール選択 */}
          <div className="flex bg-background border border-border rounded-lg p-1">
            {([
              { value: 'all', label: '全体' },
              { value: '東風', label: '東風' },
              { value: '東南', label: '東南' }
            ] as const).map(r => (
              <button
                key={r.value}
                onClick={() => setRuleFilter(r.value as RuleFilter)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  ruleFilter === r.value
                    ? 'bg-secondary text-white shadow'
                    : 'text-textMuted hover:text-textMain'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* テーブル */}
      <div className="flex-1 min-h-0 overflow-auto">
        {stats.length === 0 ? (
          <div className="h-full flex items-center justify-center text-textMuted text-sm">
            データがありません
          </div>
        ) : (
          <table className="w-full min-w-[650px] text-sm text-left text-textMain">
            <thead className="text-xs text-textMuted uppercase bg-background border-b border-border sticky top-0">
              <tr>
                <th className="py-3 px-5">期間</th>
                <th className="py-3 px-4">対局数</th>
                <th className="py-3 px-4">平均順位</th>
                <th className="py-3 px-4">順位内訳</th>
                <th className="py-3 px-4">トップ率</th>
                <th className="py-3 px-4">ラス率</th>
                <th className="py-3 px-4">平均PT</th>
                <th className="py-3 px-4">PT変動</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.key} className="border-b border-border hover:bg-surfaceHover transition-colors">
                  <td className="py-3 px-5 font-mono font-bold">{s.key}</td>
                  <td className="py-3 px-4">{s.count}</td>
                  <td className="py-3 px-4">{s.avgRank}</td>
                  <td className="py-3 px-4 tracking-widest">{s.rankBreakdown}</td>
                  <td className="py-3 px-4 text-primary font-medium">{s.firstRate}</td>
                  <td className="py-3 px-4 text-danger font-medium">{s.lastRate}</td>
                  <td className={`py-3 px-4 font-medium ${s.avgPt.startsWith('+') ? 'text-primary' : (s.avgPt.startsWith('-') ? 'text-danger' : '')}`}>
                    {s.avgPt}
                  </td>
                  <td className={`py-3 px-4 font-bold ${s.totalPt.startsWith('+') ? 'text-primary' : (s.totalPt.startsWith('-') ? 'text-danger' : '')}`}>
                    {s.totalPt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
