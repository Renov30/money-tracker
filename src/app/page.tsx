'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  storage,
  INITIAL_USER_STATS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_QUESTS,
} from '@/lib/storage';
import { Transaction, Goal, DailyQuest, UserStats, TransactionType } from '@/types';

import LingoraSidebar from '@/components/LingoraSidebar';
import LingoraTopBar from '@/components/LingoraTopBar';
import LingoraHeroBanner from '@/components/LingoraHeroBanner';
import FeaturedGoalCard from '@/components/FeaturedGoalCard';
import CoreFeaturesCards from '@/components/CoreFeaturesCards';
import TransactionsSection from '@/components/TransactionsSection';
import GoalsManagerView from '@/components/GoalsManagerView';
import LingoraRightRail from '@/components/LingoraRightRail';
import AddTransactionModal from '@/components/AddTransactionModal';
import AddGoalModal from '@/components/AddGoalModal';

export default function Home() {
  const [stats, setStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);
  
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [addTxType, setAddTxType] = useState<TransactionType>('expense');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from Backend Database via API (with localStorage fallback)
  useEffect(() => {
    async function loadData() {
      try {
        const [txRes, goalsRes, statsRes] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/goals'),
          fetch('/api/stats'),
        ]);

        if (txRes.ok) {
          const txData = await txRes.json();
          if (Array.isArray(txData) && txData.length > 0) {
            setTransactions(txData);
            storage.saveTransactions(txData);
          }
        }
        if (goalsRes.ok) {
          const goalsData = await goalsRes.json();
          if (Array.isArray(goalsData) && goalsData.length > 0) {
            setGoals(goalsData);
            storage.saveGoals(goalsData);
          }
        }
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData && statsData.level) {
            setStats(statsData);
            storage.saveStats(statsData);
          }
        }
      } catch (err) {
        console.warn('API fetch fallback to localStorage:', err);
        setStats(storage.getStats());
        setTransactions(storage.getTransactions());
        setGoals(storage.getGoals());
      }
      setQuests(storage.getQuests());
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Add XP & check Level Up
  const gainXp = (amount: number) => {
    setStats((prev) => {
      let newXp = prev.currentXp + amount;
      let newLevel = prev.level;
      let newTitle = prev.title;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        newXp = newXp - prev.xpToNextLevel;
        newTitle = `Pengatur Bijak (Level ${newLevel})`;
        showToast(`🎉 LEVEL UP! Selamat, kamu naik ke Level ${newLevel}!`);

        if (typeof window !== 'undefined') {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }

      const updated = {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        title: newTitle,
      };
      storage.saveStats(updated);

      // Async sync stats to DB
      fetch('/api/stats', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch((e) => console.warn('Sync stats error:', e));

      return updated;
    });
  };

  // Financial Computations
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalSavings = goals.reduce((acc, curr) => acc + curr.currentAmount, 0);

  // Add Transaction to Database
  const handleAddTransaction = async (data: Omit<Transaction, 'id' | 'xpEarned'>) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const json = await res.json();
        const updated = [json.transaction, ...transactions];
        setTransactions(updated);
        storage.saveTransactions(updated);
        if (json.stats) {
          setStats(json.stats);
          storage.saveStats(json.stats);
        }
        showToast(`Catatan tersimpan di database! +25 XP`);
        return;
      }
    } catch (e) {
      console.warn('API error, falling back locally:', e);
    }

    // Local fallback if API fails
    const xpReward = 25;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      ...data,
      xpEarned: xpReward,
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    storage.saveTransactions(updated);
    gainXp(xpReward);
    showToast(`Catatan keuangan tersimpan! +${xpReward} XP diperoleh.`);
  };

  // Delete Transaction from Database
  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin menghapus catatan ini?')) return;
    try {
      await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete transaction API failed:', e);
    }
    const updated = transactions.filter((tx) => tx.id !== id);
    setTransactions(updated);
    storage.saveTransactions(updated);
    showToast('Catatan telah dihapus dari database.');
  };

  // Add Goal to Database
  const handleAddGoal = async (title: string, targetAmount: number) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', title, targetAmount }),
      });

      if (res.ok) {
        const json = await res.json();
        const updated = [...goals, json.goal];
        setGoals(updated);
        storage.saveGoals(updated);
        if (json.stats) {
          setStats(json.stats);
          storage.saveStats(json.stats);
        }
        showToast(`Target "${title}" tersimpan di database! +30 XP.`);
        return;
      }
    } catch (e) {
      console.warn('API error on addGoal:', e);
    }

    // Local fallback
    const xpReward = 30;
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title,
      targetAmount,
      currentAmount: 0,
      category: 'Target Impian',
    };
    const updated = [...goals, newGoal];
    setGoals(updated);
    storage.saveGoals(updated);
    gainXp(xpReward);
    showToast(`Target "${title}" berhasil dibuat! +${xpReward} XP.`);
  };

  // Top up Goal in Database
  const handleTopUpGoal = async (goalId: string, amount: number) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'topup', id: goalId, amount }),
      });

      if (res.ok) {
        const json = await res.json();
        setGoals(json.goals);
        storage.saveGoals(json.goals);
        if (json.stats) {
          setStats(json.stats);
          storage.saveStats(json.stats);
        }
        showToast(`Berhasil menabung Rp ${amount.toLocaleString('id-ID')} ke database! +25 XP.`);
        return;
      }
    } catch (e) {
      console.warn('API error on topUpGoal:', e);
    }

    // Local fallback
    const xpReward = 25;
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        return {
          ...g,
          currentAmount: Math.min(g.targetAmount, g.currentAmount + amount),
        };
      }
      return g;
    });
    setGoals(updated);
    storage.saveGoals(updated);
    gainXp(xpReward);
    showToast(`Berhasil menabung Rp ${amount.toLocaleString('id-ID')} ke celengan! +${xpReward} XP.`);
  };

  const openAddModalWithType = (type: TransactionType = 'expense') => {
    setAddTxType(type);
    setIsAddTxOpen(true);
  };

  const activeMainGoal = goals[0] || {
    id: 'goal-default',
    title: 'Celengan Target',
    targetAmount: 5000000,
    currentAmount: 2500000,
    category: 'Target',
  };

  return (
    <div className="bg-[#faf7f2] min-h-screen w-full flex flex-col md:flex-row font-sans antialiased text-slate-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900/95 backdrop-blur-xs text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Left Sidebar */}
      <LingoraSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        level={stats.level}
        userName={stats.name}
      />

      {/* Center & Right Content Shell */}
      <div className="flex-1 flex flex-col min-h-screen bg-[#faf7f2]">
          
          {/* Top Search & Stats Bar */}
          <LingoraTopBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            streakDays={stats.streakDays}
            xpCoins={stats.currentXp}
          />

          {/* Main Dashboard Layout: Center Column + Right Rail */}
          <div className="p-4 md:p-8 flex flex-col xl:flex-row gap-6 max-w-[1600px] w-full">
            
            {/* Center Content Column (Tabs) */}
            <div className="flex-1 space-y-6">
              
              {activeTab === 'home' && (
                <>
                  {/* Hero Banner with Wallaby Mascot */}
                  <LingoraHeroBanner
                    userName={stats.name}
                    onOpenAddModal={() => openAddModalWithType('expense')}
                    activeGoalTitle={activeMainGoal.title}
                  />

                  {/* Featured Goal (Continue Learning style) */}
                  <FeaturedGoalCard
                    goal={activeMainGoal}
                    onTopUp={handleTopUpGoal}
                    onViewAllGoals={() => setActiveTab('goals')}
                  />

                  {/* 3 Core Features Cards: Pemasukan, Pengeluaran, Goals */}
                  <CoreFeaturesCards
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                    totalSavings={totalSavings}
                    onOpenAddIncome={() => openAddModalWithType('income')}
                    onOpenAddExpense={() => openAddModalWithType('expense')}
                    onOpenAddGoal={() => setIsAddGoalOpen(true)}
                  />

                  {/* Recent Transactions List */}
                  <TransactionsSection
                    transactions={transactions}
                    onDelete={handleDeleteTransaction}
                    onOpenAddModal={openAddModalWithType}
                    searchQuery={searchQuery}
                    forcedType="all"
                  />
                </>
              )}

              {activeTab === 'income' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-3xl p-6 border border-emerald-200/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        Manajemen Pemasukan (Income)
                      </h2>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        Total Pemasukan: <strong className="text-emerald-700">{totalIncome.toLocaleString('id-ID')}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => openAddModalWithType('income')}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow-xs transition"
                    >
                      + Tambah Pemasukan
                    </button>
                  </div>

                  <TransactionsSection
                    transactions={transactions}
                    onDelete={handleDeleteTransaction}
                    onOpenAddModal={openAddModalWithType}
                    searchQuery={searchQuery}
                    forcedType="income"
                  />
                </div>
              )}

              {activeTab === 'expense' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-rose-100 to-orange-100 rounded-3xl p-6 border border-rose-200/60 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">
                        Manajemen Pengeluaran (Expense)
                      </h2>
                      <p className="text-xs text-slate-600 font-medium mt-1">
                        Total Pengeluaran: <strong className="text-rose-700">{totalExpense.toLocaleString('id-ID')}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => openAddModalWithType('expense')}
                      className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-full shadow-xs transition"
                    >
                      - Catat Pengeluaran
                    </button>
                  </div>

                  <TransactionsSection
                    transactions={transactions}
                    onDelete={handleDeleteTransaction}
                    onOpenAddModal={openAddModalWithType}
                    searchQuery={searchQuery}
                    forcedType="expense"
                  />
                </div>
              )}

              {activeTab === 'goals' && (
                <GoalsManagerView
                  goals={goals}
                  onTopUp={handleTopUpGoal}
                  onOpenAddGoal={() => setIsAddGoalOpen(true)}
                />
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-6">
                  <GoalsManagerView
                    goals={goals}
                    onTopUp={handleTopUpGoal}
                    onOpenAddGoal={() => setIsAddGoalOpen(true)}
                  />
                </div>
              )}

            </div>

            {/* Right Sidebar Rail */}
            <LingoraRightRail
              streakDays={stats.streakDays}
              dailyExpenseToday={35000}
              dailyBudgetLimit={50000}
            />

          </div>

        </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        onAddTransaction={handleAddTransaction}
        initialType={addTxType}
      />

      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onAddGoal={handleAddGoal}
      />

    </div>
  );
}
