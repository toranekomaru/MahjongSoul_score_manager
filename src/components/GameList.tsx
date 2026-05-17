import type { GameRecord } from '../types';
import { Trash2 } from 'lucide-react';

type Props = {
  records: GameRecord[];
  onDelete: (id: string) => void;
};

export function GameList({ records, onDelete }: Props) {
  const displayRecords = [...records].reverse();

  if (records.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-textMuted text-sm">
        対局履歴がありません
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-sm text-left text-textMain">
        <thead className="text-xs text-textMuted uppercase bg-surface border-b border-border sticky top-0 z-10">
          <tr>
            <th className="py-2.5 px-3">日時</th>
            <th className="py-2.5 px-3">条件</th>
            <th className="py-2.5 px-3">順位</th>
            <th className="py-2.5 px-3">点数</th>
            <th className="py-2.5 px-3">終了段位</th>
            <th className="py-2.5 px-3">Pt変動 / 累計</th>
            <th className="py-2.5 px-3 text-center">削除</th>
          </tr>
        </thead>
        <tbody>
          {displayRecords.map((r) => (
            <tr key={r.id} className="border-b border-border hover:bg-surfaceHover transition-colors">
              <td className="py-2.5 px-3 font-mono text-xs">
                {r.date}
                {r.time && (
                  <span className="ml-1 text-textMuted">{r.time}</span>
                )}
              </td>
              <td className="py-2.5 px-3 text-xs font-bold">
                <span className={r.room === '玉の間' ? 'text-emerald-600' : 'text-amber-500'}>{r.room}</span>
                <span className="text-textMuted font-normal mx-1">/</span>
                <span className={r.rule === '東風' ? 'text-orange-500' : 'text-blue-500'}>{r.rule}</span>
              </td>
              <td
                className={`py-2.5 px-3 font-bold ${
                  r.rank === 1
                    ? 'text-primary'
                    : r.rank === 2
                      ? 'text-secondary'
                      : r.rank === 3
                        ? 'text-textMuted'
                        : 'text-danger'
                }`}
              >
                {r.rank}位
              </td>
              <td className="py-2.5 px-3 font-mono text-xs">{r.finalScore.toLocaleString()}</td>
              <td className="py-2.5 px-3">
                <span className="bg-background px-2 py-0.5 rounded text-xs border border-border font-medium">
                  {r.endRank}
                </span>
              </td>
              <td className="py-2.5 px-3 whitespace-nowrap">
                <span
                  className={`font-bold mr-1.5 text-xs ${
                    r.pointChanged > 0 ? 'text-primary' : r.pointChanged === 0 ? 'text-textMuted' : 'text-danger'
                  }`}
                >
                  {r.pointChanged > 0 ? '+' : ''}
                  {r.pointChanged}
                </span>
                <span className="text-textMuted font-mono text-xs">({r.endRankPt} Pt)</span>
              </td>
              <td className="py-2.5 px-3 text-center">
                <button
                  onClick={() => {
                    if (window.confirm('この対局データを削除しますか？\n後の履歴のPtも再計算されます。')) {
                      onDelete(r.id);
                    }
                  }}
                  title="削除"
                  className="text-textMuted hover:text-danger hover:bg-danger/10 p-1.5 rounded-full transition-colors inline-block"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
