import { useState, useMemo } from 'react';
import type { GameRecord, Rule } from '../../types';

type Props = {
  records: GameRecord[];
};

type RuleFilter = 'all' | Rule;
type OrderBase = 'recent' | 'oldest';

export function MatchCountStats({ records }: Props) {
  const [ruleFilter, setRuleFilter] = useState<RuleFilter>('all');
  const [chunkSize, setChunkSize] = useState<number>(10);
  const [orderBase, setOrderBase] = useState<OrderBase>('recent');

  const stats = useMemo(() => {
    // 1. ルールでフィルタリング
    const filteredRecords = records.filter(r => ruleFilter === 'all' || r.rule === ruleFilter);

    if (filteredRecords.length === 0) return [];

    const results = [];
    
    // 直近ベースなら最新の対局から遡るため逆順、古い順ベースならそのまま
    const targetRecords = orderBase === 'recent' 
      ? [...filteredRecords].reverse() 
      : filteredRecords;
    
    for (let i = 0; i < targetRecords.length; i += chunkSize) {
      const chunk = targetRecords.slice(i, i + chunkSize);
      const startMatch = i + 1;
      const endMatch = i + chunk.length;
      const count = chunk.length;

      let sumRank = 0;
      let ptChange = 0;
      let firsts = 0;
      let seconds = 0;
      let thirds = 0;
      let fourths = 0;

      for (const r of chunk) {
        sumRank += r.rank;
        ptChange += r.pointChanged;
        if (r.rank === 1) firsts++;
        else if (r.rank === 2) seconds++;
        else if (r.rank === 3) thirds++;
        else if (r.rank === 4) fourths++;
      }

      const avgPtVal = ptChange / count;

      results.push({
        interval: orderBase === 'recent' ? `直近 ${startMatch}～${endMatch}戦` : `${startMatch}～${endMatch}戦`,
        count,
        avgRank: (sumRank / count).toFixed(2),
        rankBreakdown: `${firsts}-${seconds}-${thirds}-${fourths}`,
        firstRate: ((firsts / count) * 100).toFixed(1) + '%',
        lastRate: ((fourths / count) * 100).toFixed(1) + '%',
        totalPt: ptChange > 0 ? '+' + ptChange : String(ptChange),
        avgPt: avgPtVal > 0 ? '+' + avgPtVal.toFixed(1) : avgPtVal.toFixed(1),
      });
    }
    // 古い順ベースの場合、最新のチャンクが一番上（またはその逆）にするかはお好みですが、
    // ここでは「表の上から順に見ていく」時に自然な形になるよう、
    // 直近ベースの場合は作成順そのまま（最新が一番上）
    // 古い順ベースの場合は新しいチャンクが上に来るようリバースします。
    return orderBase === 'recent' ? results : results.reverse();
  }, [records, ruleFilter, chunkSize, orderBase]);

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden h-full">
      {/* ヘッダー・操作パネル */}
      <div className="px-5 py-4 border-b border-border shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-base font-bold text-primary">対戦数別集計</h2>
        
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
          {/* 集計ベース選択 */}
          <div className="flex bg-background border border-border rounded-lg p-1">
            {([
              { value: 'recent', label: '直近ベース' },
              { value: 'oldest', label: '古い順ベース' }
            ] as const).map(base => (
              <button
                key={base.value}
                onClick={() => setOrderBase(base.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  orderBase === base.value
                    ? 'bg-amber-600 text-white shadow'
                    : 'text-textMuted hover:text-textMain'
                }`}
              >
                {base.label}
              </button>
            ))}
          </div>

          {/* 区切り選択 */}
          <div className="flex bg-background border border-border rounded-lg p-1">
            {([10, 20, 50, 100] as const).map(size => (
              <button
                key={size}
                onClick={() => setChunkSize(size)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  chunkSize === size
                    ? 'bg-primary text-white shadow'
                    : 'text-textMuted hover:text-textMain'
                }`}
              >
                {size}戦
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
                <th className="py-3 px-5">区切り</th>
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
                <tr key={s.interval} className="border-b border-border hover:bg-surfaceHover transition-colors">
                  <td className="py-3 px-5 font-bold text-secondary">{s.interval}</td>
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
