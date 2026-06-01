import { useMemo } from 'react';
import type { GameRecord } from '../../types';
import { Flame, AlertTriangle } from 'lucide-react';

type CommentType = 'good' | 'bad' | 'neutral';

interface Comment {
  id: string;
  type: CommentType;
  text: string;
}

export function SummaryComments({ records }: { records: GameRecord[] }) {
  const comments = useMemo(() => {
    if (records.length === 0) return [];

    const generated: Comment[] = [];
    
    // 1. ストリーク（連続記録）の判定
    // 最新から遡る
    let current1st = 0;
    let currentTop2 = 0;
    let currentBottom2 = 0;
    let current4th = 0;
    let currentNo4th = 0;
    let currentNo1st = 0;

    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i].rank;
      if (r === 1) current1st++; else break;
    }
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i].rank;
      if (r <= 2) currentTop2++; else break;
    }
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i].rank;
      if (r >= 3) currentBottom2++; else break;
    }
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i].rank;
      if (r === 4) current4th++; else break;
    }
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i].rank;
      if (r !== 4) currentNo4th++; else break;
    }
    for (let i = records.length - 1; i >= 0; i--) {
      const r = records[i].rank;
      if (r !== 1) currentNo1st++; else break;
    }

    if (current1st >= 3) {
      generated.push({ id: 'streak-1st', type: 'good', text: `${current1st}連続トップ！` });
    } else if (currentTop2 >= 5) {
      generated.push({ id: 'streak-top2', type: 'good', text: `${currentTop2}連続連対！安定しています` });
    }

    if (current4th >= 3) {
      generated.push({ id: 'streak-4th', type: 'bad', text: `${current4th}連続ラス…守備を見直そう` });
    } else if (currentBottom2 >= 5) {
      generated.push({ id: 'streak-bottom2', type: 'bad', text: `${currentBottom2}連続逆連対…踏ん張りどころです` });
    }

    if (currentNo4th >= 10) {
      generated.push({ id: 'streak-no4th', type: 'good', text: `${currentNo4th}連続ラスなし！素晴らしい安定感です` });
    }
    if (currentNo1st >= 10) {
      generated.push({ id: 'streak-no1st', type: 'bad', text: `${currentNo1st}連続トップなし…我慢の時期です` });
    }

    // 2. 直近N戦の判定
    const recentN = Math.min(10, records.length);
    if (recentN >= 5) { // ある程度データがないと偏るため5戦以上で判定
      const recentRecords = records.slice(-recentN);
      let firsts = 0;
      let fourths = 0;
      let sumRank = 0;

      recentRecords.forEach(r => {
        if (r.rank === 1) firsts++;
        if (r.rank === 4) fourths++;
        sumRank += r.rank;
      });

      const topRate = firsts / recentN;
      const lastRate = fourths / recentN;
      const avgRank = sumRank / recentN;

      if (topRate >= 0.4) {
        generated.push({ id: 'recent-top', type: 'good', text: `直近${recentN}戦トップ率${Math.round(topRate * 100)}%！` });
      }
      if (lastRate >= 0.4) {
        generated.push({ id: 'recent-last', type: 'bad', text: `直近${recentN}戦ラス率が高めです` });
      }
      if (avgRank <= 2.3) {
        generated.push({ id: 'recent-avg-good', type: 'good', text: `直近${recentN}戦平均順位${avgRank.toFixed(2)}！絶好調です` });
      }
      if (avgRank >= 2.8) {
        generated.push({ id: 'recent-avg-bad', type: 'bad', text: `直近${recentN}戦平均順位${avgRank.toFixed(2)}…不調気味です` });
      }
    }

    // 最大3件まで
    return generated.slice(0, 3);
  }, [records]);

  if (comments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {comments.map((comment) => {
        const isGood = comment.type === 'good';
        const Icon = isGood ? Flame : AlertTriangle;
        const colorCls = isGood 
          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
          : 'bg-rose-500/10 text-rose-600 border-rose-500/20';

        return (
          <div 
            key={comment.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-bold ${colorCls}`}
          >
            <Icon size={16} />
            {comment.text}
          </div>
        );
      })}
    </div>
  );
}
