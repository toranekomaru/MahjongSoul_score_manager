import type { Rank, Rule, Room, RankTier } from "../types";

type RankPointTable = {
  [room in Room]: {
    [rule in Rule]: {
      [rankTier in RankTier]?: {
        [rank in Rank]: number;
      };
    };
  };
};

export const rankPointTable: RankPointTable = {
  玉の間: {
    東風: {
      雀豪1: { 1: 70, 2: 35, 3: -5, 4: -95 },
      雀豪2: { 1: 70, 2: 35, 3: -5, 4: -105 },
      雀豪3: { 1: 70, 2: 35, 3: -5, 4: -115 },
      雀聖1: { 1: 70, 2: 35, 3: -5, 4: -125 },
      雀聖2: { 1: 70, 2: 35, 3: -5, 4: -135 },
      雀聖3: { 1: 70, 2: 35, 3: -5, 4: -145 },
    },
    東南: {
      雀豪1: { 1: 125, 2: 60, 3: -5, 4: -180 },
      雀豪2: { 1: 125, 2: 60, 3: -5, 4: -195 },
      雀豪3: { 1: 125, 2: 60, 3: -5, 4: -210 },
      雀聖1: { 1: 125, 2: 60, 3: -5, 4: -225 },
      雀聖2: { 1: 125, 2: 60, 3: -5, 4: -240 },
      雀聖3: { 1: 125, 2: 60, 3: -5, 4: -255 },
    },
  },
  王座の間: {
    東風: {
      雀聖1: { 1: 75, 2: 35, 3: -5, 4: -125 },
      雀聖2: { 1: 75, 2: 35, 3: -5, 4: -135 },
      雀聖3: { 1: 75, 2: 35, 3: -5, 4: -145 },
    },
    東南: {
      雀聖1: { 1: 135, 2: 65, 3: -5, 4: -225 },
      雀聖2: { 1: 135, 2: 65, 3: -5, 4: -240 },
      雀聖3: { 1: 135, 2: 65, 3: -5, 4: -255 },
    },
  },
};

export const rankConfig: Record<RankTier, { initial: number; promotion: number }> = {
  "雀豪1": { initial: 1400, promotion: 2800 },
  "雀豪2": { initial: 1600, promotion: 3200 },
  "雀豪3": { initial: 1800, promotion: 3600 },
  "雀聖1": { initial: 2000, promotion: 4000 },
  "雀聖2": { initial: 3000, promotion: 6000 },
  "雀聖3": { initial: 4500, promotion: 9000 },
};

export function getRankPoint(
  room: Room,
  rule: Rule,
  rankTier: RankTier,
  rank: Rank
): number {
  const table = rankPointTable[room]?.[rule]?.[rankTier];

  if (!table) {
    throw new Error(`順位点テーブル未定義: ${room} ${rule} ${rankTier}`);
  }

  return table[rank];
}

export function calcDanPoint(
  room: Room,
  rule: Rule,
  rankTier: RankTier,
  rank: Rank,
  finalScore: number
): number {
  const rankPoint = getRankPoint(room, rule, rankTier, rank);
  const scoreDiff = Math.ceil((finalScore - 25000) / 1000);

  return rankPoint + scoreDiff;
}

const rankOrder: RankTier[] = ["雀豪1", "雀豪2", "雀豪3", "雀聖1", "雀聖2", "雀聖3"];

export function calculateNewRank(currentRank: RankTier, currentPt: number, pointChange: number): { newRank: RankTier; newPt: number } {
  let newPt = currentPt + pointChange;
  let newRank = currentRank;
  
  const currentConfig = rankConfig[currentRank];
  
  // 昇段
  if (newPt >= currentConfig.promotion) {
    if (currentRank !== "雀聖3") {
      const rankIndex = rankOrder.indexOf(currentRank);
      newRank = rankOrder[rankIndex + 1];
      newPt = rankConfig[newRank].initial;
    }
  } 
  // 降段
  else if (newPt < 0) {
    if (currentRank !== "雀豪1") {
      const rankIndex = rankOrder.indexOf(currentRank);
      newRank = rankOrder[rankIndex - 1];
      newPt = rankConfig[newRank].initial;
    } else {
      newPt = 0; // 雀豪1は降段なし
    }
  }

  return { newRank, newPt };
}
