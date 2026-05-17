import { useState, useEffect, useCallback } from "react";
import type { GameRecord, SettingsInfo, RankTier } from "../types";
import { getSettings, saveSettings, getAllGameRecords, addGameRecord, updateGameRecord, deleteGameRecord, clearAllGameRecords } from "../lib/db";
import { calcDanPoint, calculateNewRank } from "../lib/mahjongLogic";

export function useGameData() {
  const [settings, setSettingsState] = useState<SettingsInfo | null>(null);
  const [records, setRecords] = useState<GameRecord[]>([]);
  const [currentRank, setCurrentRank] = useState<RankTier>("雀豪1");
  const [currentPt, setCurrentPt] = useState<number>(1400);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const s = await getSettings();
    setSettingsState(s);
    
    // Timestamp(id) もしくは date 順にソートして過去から順に計算する
    // idにタイムスタンプを含める想定だが、簡易的に日付とidでソート
    const rawRecords = await getAllGameRecords();
    rawRecords.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // 同日の場合は時刻で比較（time がない場合は id で比較）
      if (a.time && b.time && a.time !== b.time) {
        return a.time.localeCompare(b.time);
      }
      return a.id.localeCompare(b.id);
    });
    
    // 設定の初期段位・初期Ptからスタートし、全履歴のPtを時系列で再計算
    let curRank = s.initialRank;
    let curPt = s.initialPt;
    
    const computedRecords = rawRecords.map(record => {
      const ptDiff = calcDanPoint(record.room, record.rule, curRank, record.rank, record.finalScore);
      const { newRank, newPt } = calculateNewRank(curRank, curPt, ptDiff);
      
      const computed: GameRecord = {
        ...record,
        startRank: curRank,
        pointChanged: ptDiff,
        endRank: newRank,
        endRankPt: newPt
      };
      
      curRank = newRank;
      curPt = newPt;
      
      return computed;
    });
    
    setRecords(computedRecords);
    setCurrentRank(curRank);
    setCurrentPt(curPt);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveSettings = async (newSettings: SettingsInfo) => {
    await saveSettings(newSettings);
    await loadData();
  };

  const handleAddRecord = async (record: GameRecord) => {
    await addGameRecord(record);
    await loadData();
  };

  const handleUpdateRecord = async (id: string, updated: Partial<GameRecord>) => {
    await updateGameRecord(id, updated);
    await loadData();
  };

  const handleDeleteRecord = async (id: string) => {
    await deleteGameRecord(id);
    await loadData();
  };

  const handleClearAll = async () => {
    await clearAllGameRecords();
    await loadData();
  };

  return {
    settings,
    records,
    currentRank,
    currentPt,
    loading,
    refresh: loadData,
    handleSaveSettings,
    handleAddRecord,
    handleUpdateRecord,
    handleDeleteRecord,
    handleClearAll
  };
}
