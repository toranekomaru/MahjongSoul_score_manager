import type { GameRecord } from '../../types';
import { SummaryComments } from './SummaryComments';

export function Summary({ records }: { records: GameRecord[] }) {
  const total = records.length;
  if (total === 0) return null;

  const avgRank = records.reduce((sum, r) => sum + r.rank, 0) / total;
  const rankCounts = [0, 0, 0, 0];
  records.forEach((r) => rankCounts[r.rank - 1]++);
  const rankRates = rankCounts.map((count) => (count / total) * 100);
  const avgPtChange = records.reduce((sum, r) => sum + r.pointChanged, 0) / total;

  const stats = [
    { label: '総対局数', value: total, unit: '局', color: 'text-textMain' },
    { label: '平均順位', value: avgRank.toFixed(2), unit: '位', color: 'text-secondary' },
    { label: '段位PT 平均', value: (avgPtChange > 0 ? '+' : '') + avgPtChange.toFixed(1), unit: '', color: avgPtChange >= 0 ? 'text-primary' : 'text-danger' },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl px-5 py-4 shadow-lg">
      <SummaryComments records={records} />
      <div className="flex flex-wrap items-center gap-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <span className="text-xs text-textMuted font-medium">{s.label}</span>
            <span className={`text-2xl font-black ${s.color}`}>
              {s.value}
              {s.unit && <span className="text-sm font-normal text-textMuted ml-1">{s.unit}</span>}
            </span>
          </div>
        ))}

        {/* 順位率バー */}
        <div className="flex-1 min-w-[180px]">
          <span className="text-xs text-textMuted font-medium block mb-1">順位率</span>
          <div className="flex h-5 rounded-full overflow-hidden w-full bg-border">
            <div style={{ width: `${rankRates[0]}%` }} className="bg-primary" title={`1位: ${rankRates[0].toFixed(1)}%`} />
            <div style={{ width: `${rankRates[1]}%` }} className="bg-secondary" title={`2位: ${rankRates[1].toFixed(1)}%`} />
            <div style={{ width: `${rankRates[2]}%` }} className="bg-textMuted" title={`3位: ${rankRates[2].toFixed(1)}%`} />
            <div style={{ width: `${rankRates[3]}%` }} className="bg-danger" title={`4位: ${rankRates[3].toFixed(1)}%`} />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-textMuted">
            {rankRates.map((rate, i) => (
              <span key={i}>{i + 1}位 {rate.toFixed(1)}%</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
