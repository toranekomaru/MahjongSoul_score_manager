import type { GameRecord } from '../../types';
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
      {/* モバイル向けカード一覧 */}
      <div className="md:hidden flex flex-col divide-y divide-border">
        {displayRecords.map((r) => {
          const rankColors: Record<number, string> = {
            1: 'bg-primary/10 text-primary border-primary/20',
            2: 'bg-secondary/10 text-secondary border-secondary/20',
            3: 'bg-textMuted/15 text-textMuted border-textMuted/20',
            4: 'bg-danger/10 text-danger border-danger/20'
          };
          return (
            <div key={r.id} className="p-4 flex flex-col gap-2.5 hover:bg-surfaceHover transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-sm shrink-0 ${rankColors[r.rank]}`}>
                    {r.rank}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-textMuted font-mono">
                      {r.date} {r.time && <span className="ml-1">{r.time}</span>}
                    </span>
                    <span className="text-xs font-bold flex items-center gap-1">
                      <span className={r.room === '玉の間' ? 'text-emerald-600' : 'text-amber-500'}>{r.room}</span>
                      <span className="text-textMuted font-normal">/</span>
                      <span className={r.rule === '東風' ? 'text-orange-500' : 'text-blue-500'}>{r.rule}</span>
                      <span className="bg-background px-1.5 py-0.5 rounded text-[9px] border border-border font-medium ml-1.5 text-textMain">
                        {r.endRank}
                      </span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('この対局データを削除しますか？\n後の履歴のPtも再計算されます。')) {
                      onDelete(r.id);
                    }
                  }}
                  className="text-textMuted hover:text-danger hover:bg-danger/10 p-2 rounded-full transition-colors"
                  title="削除"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex justify-between items-center bg-background/50 rounded-xl px-3 py-2 border border-border/60">
                <div className="flex flex-col">
                  <span className="text-[9px] text-textMuted">最終点数</span>
                  <span className="text-xs font-mono font-bold text-textMain">{r.finalScore.toLocaleString()} 点</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-textMuted">Pt変動 (終了Pt)</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${r.pointChanged > 0 ? 'text-primary' : r.pointChanged === 0 ? 'text-textMuted' : 'text-danger'}`}>
                      {r.pointChanged > 0 ? '+' : ''}{r.pointChanged}
                    </span>
                    <span className="text-[10px] text-textMuted font-mono">({r.endRankPt} Pt)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* デスクトップ向けテーブル表示 */}
      <table className="hidden md:table w-full text-sm text-left text-textMain">
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
