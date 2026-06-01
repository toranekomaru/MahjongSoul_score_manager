import { useMemo } from 'react';
import type { GameRecord } from '../../types';

type Props = {
  records: GameRecord[];
  height?: number;
};

export function StatsByCondition({ records, height }: Props) {
  const stats = useMemo(() => {
    const grouped = records.reduce(
      (acc, r) => {
        const key = `${r.room}・${r.rule}`;
        if (!acc[key]) {
          acc[key] = { count: 0, sumRank: 0, firsts: 0, fourths: 0, ptChange: 0 };
        }
        acc[key].count++;
        acc[key].sumRank += r.rank;
        acc[key].ptChange += r.pointChanged;
        if (r.rank === 1) acc[key].firsts++;
        if (r.rank === 4) acc[key].fourths++;
        return acc;
      },
      {} as Record<string, { count: number; sumRank: number; firsts: number; fourths: number; ptChange: number }>,
    );

    return Object.entries(grouped).map(([key, val]: [string, any]) => {
      const avgPtVal = val.ptChange / val.count;
      return {
        key,
        count: val.count,
        avgRank: (val.sumRank / val.count).toFixed(2),
        firstRate: ((val.firsts / val.count) * 100).toFixed(1) + '%',
        lastRate: ((val.fourths / val.count) * 100).toFixed(1) + '%',
        totalPt: val.ptChange > 0 ? '+' + val.ptChange : String(val.ptChange),
        avgPt: avgPtVal > 0 ? '+' + avgPtVal.toFixed(1) : avgPtVal.toFixed(1),
      };
    });
  }, [records]);

  if (stats.length === 0) return null;

  return (
    <div
      className={`bg-surface border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden${height ? '' : ' h-full'}`}
      style={height ? { height } : undefined}
    >
      <div className="px-5 pt-4 pb-2 shrink-0">
        <h2 className="text-sm font-bold text-primary">条件別成績</h2>
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <table className="w-full min-w-[500px] text-xs text-left text-textMain">
          <thead className="text-[11px] text-textMuted uppercase bg-background border-b border-border sticky top-0">
            <tr>
              <th className="py-2 px-4">部屋・ルール</th>
              <th className="py-2 px-4">対局数</th>
              <th className="py-2 px-4">平均順位</th>
              <th className="py-2 px-4">トップ率</th>
              <th className="py-2 px-4">ラス率</th>
              <th className="py-2 px-4">平均PT</th>
              <th className="py-2 px-4">PT変動合計</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.key} className="border-b border-border hover:bg-surfaceHover transition-colors">
                <td className="py-2.5 px-4 font-medium">{s.key}</td>
                <td className="py-2.5 px-4">{s.count}</td>
                <td className="py-2.5 px-4">{s.avgRank}</td>
                <td className="py-2.5 px-4 text-primary font-medium">{s.firstRate}</td>
                <td className="py-2.5 px-4 text-danger font-medium">{s.lastRate}</td>
                <td className={`py-2.5 px-4 font-medium ${s.avgPt.startsWith('+') ? 'text-primary' : (s.avgPt.startsWith('-') ? 'text-danger' : '')}`}>
                  {s.avgPt}
                </td>
                <td className={`py-2.5 px-4 font-medium ${s.totalPt.startsWith('+') ? 'text-primary' : (s.totalPt.startsWith('-') ? 'text-danger' : '')}`}>
                  {s.totalPt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
