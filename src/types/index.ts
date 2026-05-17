export type Rank = 1 | 2 | 3 | 4;
export type Rule = "東風" | "東南";
export type Room = "玉の間" | "王座の間";
export type RankTier =
  | "雀豪1" | "雀豪2" | "雀豪3"
  | "雀聖1" | "雀聖2" | "雀聖3";

export type GameRecord = {
  id: string;      // UUID or timestamp based
  date: string;    // yyyy-mm-dd
  time?: string;   // HH:mm（省略可能・既存データとの互換性保持）
  rank: Rank;
  finalScore: number;
  rule: Rule;
  room: Room;
  startRank: RankTier;
  // 以下は保存時に計算済みのものを保持（再計算用のキャッシュや表示用途）
  pointChanged: number;
  endRank: RankTier;
  endRankPt: number;
};

export type SettingsInfo = {
  id: number;
  initialRank: RankTier;
  initialPt: number;
};
