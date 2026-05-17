import Dexie, { type EntityTable } from 'dexie';
import type { GameRecord, SettingsInfo } from '../types';

export const db = new Dexie('MahjongScoreDB') as Dexie & {
  gameRecords: EntityTable<GameRecord, 'id'>;
  settings: EntityTable<SettingsInfo, 'id'>;
};

db.version(1).stores({
  gameRecords: 'id, date, rule, room, startRank',
  settings: 'id'
});

export const getSettings = async (): Promise<SettingsInfo> => {
  const settings = await db.settings.get(1);
  return settings || { id: 1, initialRank: "雀豪1", initialPt: 1400 };
};

export const saveSettings = async (settings: SettingsInfo) => {
  await db.settings.put(settings);
};

export const getAllGameRecords = async (): Promise<GameRecord[]> => {
  return await db.gameRecords.orderBy('date').toArray(); // Basic sort, memory sort may be needed for accurate id/timestamp 
};

export const addGameRecord = async (record: GameRecord) => {
  await db.gameRecords.add(record);
};

export const updateGameRecord = async (id: string, record: Partial<GameRecord>) => {
  await db.gameRecords.update(id, record);
};

export const deleteGameRecord = async (id: string) => {
  await db.gameRecords.delete(id);
};

export const clearAllGameRecords = async () => {
  await db.gameRecords.clear();
}
