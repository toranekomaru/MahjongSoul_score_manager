import type { GameRecord, RankTier, SettingsInfo } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { rankConfig } from '../../lib/mahjongLogic';

type Props = {
  records: GameRecord[];
  settings: SettingsInfo;
  height?: number;
};

export function RatingGraph({ records, settings, height }: Props) {
  const data = [
    {
      name: 0,
      pt: settings.initialPt,
      rank: settings.initialRank,
      date: '初期設定',
    },
    ...records.map((r, i) => ({
      name: i + 1,
      pt: r.endRankPt,
      rank: r.endRank,
      date: r.date,
    }))
  ];

  const containerStyle = height ? { height } : undefined;
  const containerCls = `bg-surface border border-border rounded-2xl shadow-lg flex flex-col${height ? '' : ' h-full'}`;

  if (records.length === 0) {
    return (
      <div className={containerCls} style={containerStyle}>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-textMuted text-sm">対局データがありません</p>
        </div>
      </div>
    );
  }

  const latestRank = data[data.length - 1].rank as RankTier;
  const maxPt = rankConfig[latestRank]?.promotion || 'auto';

  return (
    <div className={containerCls} style={containerStyle}>
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-sm font-bold text-primary">段位ポイント推移</h2>
      </div>
      <div className="flex-1 min-h-0 px-2 pb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" domain={[0, maxPt]} tick={{ fontSize: 11 }} width={50} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e24',
                borderColor: '#334155',
                color: '#f8fafc',
                borderRadius: '0.5rem',
                fontSize: '12px',
              }}
              itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
              labelFormatter={(_, payload) => {
                const item = payload?.[0]?.payload;
                if (!item) return '';
                if (item.name === 0) return `初期設定 - ${item.rank}`;
                return `対局 #${item.name} (${item.date}) - ${item.rank}`;
              }}
              formatter={(value: unknown) => [`${value} Pt`, 'ポイント']}
            />
            <Line
              type="monotone"
              dataKey="pt"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ fill: '#1e1e24', stroke: '#0ea5e9', strokeWidth: 2, r: 3 }}
              activeDot={{ fill: '#0ea5e9', stroke: '#f8fafc', strokeWidth: 2, r: 5 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
