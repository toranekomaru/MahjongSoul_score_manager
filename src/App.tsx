import { useState } from 'react';
import { useGameData } from './hooks/useGameData';
import { CompactGameForm } from './components/CompactGameForm';
import { GameList } from './components/GameList';
import { Settings } from './components/Settings';
import { Summary } from './components/Summary';
import { StatsByCondition } from './components/StatsByCondition';
import { RatingGraph } from './components/RatingGraph';
import { PeriodStats } from './components/PeriodStats';
import { MatchCountStats } from './components/MatchCountStats';
import { LayoutDashboard, History, Settings as SettingsIcon, AlertCircle, Calendar, Hash } from 'lucide-react';

function App() {
  const {
    settings,
    records,
    currentRank,
    currentPt,
    loading,
    handleSaveSettings,
    handleAddRecord,
    handleDeleteRecord,
    handleClearAll,
  } = useGameData();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'periodStats' | 'matchCountStats' | 'settings'>('dashboard');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    // モバイル時は画面全体のスクロールを許可し、下部ナビゲーション分の余白（pb-20）を確保。PC時は従来どおり固定。
    <div className="h-screen md:h-screen flex flex-col bg-background text-textMain overflow-y-auto md:overflow-hidden pb-16 md:pb-0">
      {/* ヘッダー */}
      <header className="bg-surface border-b border-border shrink-0 z-50 sticky top-0 md:relative">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          {/* ロゴ */}
          <span className="text-lg md:text-xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap shrink-0">
            雀魂 Record
          </span>

          {/* タブナビ（PC時のみ表示） */}
          <nav className="hidden md:flex gap-1 bg-background p-1 rounded-xl border border-border">
            {(
              [
                { key: 'dashboard', label: 'ダッシュボード', Icon: LayoutDashboard },
                { key: 'periodStats', label: '期間別', Icon: Calendar },
                { key: 'matchCountStats', label: '対戦数別', Icon: Hash },
                { key: 'history', label: '履歴', Icon: History },
                { key: 'settings', label: '設定', Icon: SettingsIcon },
              ] as const
            ).map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-sm transition-all ${
                  activeTab === key
                    ? 'bg-primary text-white shadow shadow-primary/20'
                    : 'text-textMuted hover:text-textMain hover:bg-surfaceHover'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>

          {/* 現在の段位・Pt（モバイル時は文字サイズなどをさらにコンパクトに調整） */}
          <div className="flex items-center gap-1.5 md:gap-2 bg-background py-1 px-2.5 md:py-1.5 md:px-3 rounded-xl border border-border shrink-0">
            <span className="text-textMuted text-[10px] md:text-xs">現在の段位</span>
            <span className="text-primary font-bold text-xs md:text-sm">{currentRank}</span>
            <span className="text-border mx-0.5 md:mx-1">|</span>
            <span className="text-secondary font-mono font-bold text-xs md:text-sm">{currentPt} pt</span>
          </div>
        </div>
      </header>

      {/* コンテンツエリア */}
      <main className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
        <div className="h-auto md:h-full max-w-[1400px] mx-auto px-4 md:px-6 py-3 md:py-4 flex flex-col gap-4">
          {/* ━━ ダッシュボード ━━ */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-4 h-full">
              {/* 登録フォーム */}
              <div className="shrink-0">
                <CompactGameForm onAdd={handleAddRecord} currentRank={currentRank} />
              </div>

              {/* サマリー統計 */}
              {records.length > 0 && (
                <div className="shrink-0">
                  <Summary records={records} />
                </div>
              )}

              {/* グラフ + 条件別成績 */}
              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                <RatingGraph records={records} settings={settings!} height={undefined} />
                {records.length > 0 && <StatsByCondition records={records} />}
              </div>
            </div>
          )}

          {/* ━━ 期間別 ━━ */}
          {activeTab === 'periodStats' && (
            <div className="h-full pb-4">
              <PeriodStats records={records} />
            </div>
          )}

          {/* ━━ 对战数別 ━━ */}
          {activeTab === 'matchCountStats' && (
            <div className="h-full pb-4">
              <MatchCountStats records={records} />
            </div>
          )}

          {/* ━━ 履歴 ━━ */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-4 h-full">
              {/* コンパクト登録フォーム */}
              <div className="shrink-0">
                <CompactGameForm onAdd={handleAddRecord} currentRank={currentRank} />
              </div>

              {/* 履歴テーブル/カードリスト（flex-1 で残り全高さ） */}
              <div className="flex-1 min-h-0 bg-surface border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden">
                <div className="px-5 py-3 border-b border-border shrink-0 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-primary">対局履歴</h2>
                  {records.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('本当にすべてのデータを削除しますか？\n元に戻すことはできません。')) {
                          handleClearAll();
                        }
                      }}
                      className="flex items-center gap-1.5 text-danger hover:bg-danger/10 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border border-danger/30"
                    >
                      <AlertCircle size={14} />
                      全データ削除
                    </button>
                  )}
                </div>
                <GameList records={records} onDelete={handleDeleteRecord} />
              </div>
            </div>
          )}

          {/* ━━ 設定 ━━ */}
          {activeTab === 'settings' && (
            <div className="max-w-md">
              <Settings settings={settings} onSave={handleSaveSettings} />
            </div>
          )}
        </div>
      </main>

      {/* モバイル向けボトムナビゲーション */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/85 backdrop-blur-md border-t border-border flex justify-around py-2 px-1 z-50 shadow-lg pb-[calc(8px+env(safe-area-inset-bottom))]">
        {(
          [
            { key: 'dashboard', label: 'ホーム', Icon: LayoutDashboard },
            { key: 'periodStats', label: '期間別', Icon: Calendar },
            { key: 'matchCountStats', label: '対戦数別', Icon: Hash },
            { key: 'history', label: '履歴', Icon: History },
            { key: 'settings', label: '設定', Icon: SettingsIcon },
          ] as const
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              activeTab === key
                ? 'text-primary scale-105 font-bold animate-pulse-subtle'
                : 'text-textMuted hover:text-textMain'
            }`}
          >
            <Icon size={18} className={activeTab === key ? 'text-primary' : 'text-textMuted'} />
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
