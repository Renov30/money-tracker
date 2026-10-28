'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  storage,
  INITIAL_USER_STATS,
  INITIAL_TRANSACTIONS,
  INITIAL_GOALS,
  INITIAL_QUESTS,
} from '@/lib/storage';
import { Transaction, Goal, DailyQuest, UserStats, TransactionType, CustomCategory, AuthUser } from '@/types';

import LingoraSidebar from '@/components/LingoraSidebar';
import LingoraTopBar from '@/components/LingoraTopBar';
import LingoraHeroBanner from '@/components/LingoraHeroBanner';
import FeaturedGoalCard from '@/components/FeaturedGoalCard';
import FinancialSummaryCards from '@/components/FinancialSummaryCards';
import TransactionsSection from '@/components/TransactionsSection';
import GoalsManagerView from '@/components/GoalsManagerView';
import LingoraRightRail from '@/components/LingoraRightRail';
import AddTransactionModal from '@/components/AddTransactionModal';
import GoalModal from '@/components/GoalModal';
import ConfirmDialogModal from '@/components/ConfirmDialogModal';
import ManageCategoriesModal from '@/components/ManageCategoriesModal';
import TrashView from '@/components/TrashView';
import AccountSettingsModal from '@/components/AccountSettingsModal';
import ToastNotification, { ToastData, ToastType } from '@/components/ToastNotification';

export default function Home() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [trashTransactions, setTrashTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [quests, setQuests] = useState<DailyQuest[]>(INITIAL_QUESTS);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [addTxType, setAddTxType] = useState<TransactionType>('expense');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);

  // Category Manager Modal State
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [manageCategoriesType, setManageCategoriesType] = useState<TransactionType>('expense');
  
  // Custom Confirmation Dialog State (replacing native confirm)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<'soft' | 'permanent' | 'empty_trash' | 'goal'>('soft');
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Custom Toast State (replacing native alert)
  const [toast, setToast] = useState<ToastData | null>(null);

  // Load from Backend Database via API (with localStorage fallback)
  useEffect(() => {
    async function loadData() {
      try {
        const [txRes, goalsRes, statsRes, catRes, trashRes, authRes] = await Promise.all([
          fetch('/api/transactions'),
          fetch('/api/goals'),
          fetch('/api/stats'),
          fetch('/api/categories'),
          fetch('/api/transactions?trash=true'),
          fetch('/api/auth'),
        ]);

        if (authRes.ok) {
          const authData = await authRes.json();
          if (authData.user) {
            setCurrentUser(authData.user);
          } else {
            // User belum login atau sesi berakhir -> arahkan langsung ke halaman login
            router.push('/login');
            return;
          }
        } else {
          router.push('/login');
          return;
        }

        if (txRes.ok) {
          const txData = await txRes.json();
          if (Array.isArray(txData)) {
            setTransactions(txData);
            storage.saveTransactions(txData);
          }
        }
        if (trashRes.ok) {
          const trashData = await trashRes.json();
          if (Array.isArray(trashData)) {
            setTrashTransactions(trashData);
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
        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData)) {
            setCustomCategories(catData);
            storage.saveCategories(catData);
          }
        }
      } catch (err) {
        console.warn('API fetch fallback to localStorage:', err);
        setStats(storage.getStats());
        setTransactions(storage.getTransactions());
        setTrashTransactions(storage.getTrashTransactions());
        setGoals(storage.getGoals());
        setCustomCategories(storage.getCategories());
      }
      setQuests(storage.getQuests());
    }
    loadData();
  }, []);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
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
        showToast(`LEVEL UP! Selamat, kamu naik ke Level ${newLevel}!`, 'level-up');

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

  // Prompt Soft Delete (moves to trash)
  const promptDeleteTransaction = (id: string) => {
    setDeleteTargetId(id);
    setDeleteMode('soft');
    setIsConfirmDeleteOpen(true);
  };

  // Prompt Permanent Delete (from trash)
  const promptPermanentDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteMode('permanent');
    setIsConfirmDeleteOpen(true);
  };

  // Prompt Empty Trash
  const promptEmptyTrash = () => {
    setDeleteTargetId(null);
    setDeleteMode('empty_trash');
    setIsConfirmDeleteOpen(true);
  };

  // Execute Deletes (Soft / Permanent / Empty)
  const handleExecuteDelete = async () => {
    if (deleteMode === 'soft' && deleteTargetId) {
      const id = deleteTargetId;
      const targetTx = transactions.find((t) => t.id === id);
      try {
        await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Soft delete transaction API failed:', e);
      }
      const updatedActive = transactions.filter((tx) => tx.id !== id);
      setTransactions(updatedActive);
      storage.saveTransactions(updatedActive);

      if (targetTx) {
        const deletedItem: Transaction = {
          ...targetTx,
          deletedAt: new Date().toISOString(),
        };
        setTrashTransactions((prev) => [deletedItem, ...prev]);
      }
      showToast('Catatan dipindahkan ke Tempat Sampah (tersimpan 30 hari).', 'delete');
    } else if (deleteMode === 'permanent' && deleteTargetId) {
      const id = deleteTargetId;
      try {
        await fetch(`/api/transactions?id=${id}&permanent=true`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Permanent delete transaction API failed:', e);
      }
      setTrashTransactions((prev) => prev.filter((tx) => tx.id !== id));
      showToast('Catatan telah dihapus secara permanen.', 'delete');
    } else if (deleteMode === 'empty_trash') {
      try {
        await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'empty_trash' }),
        });
      } catch (e) {
        console.warn('Empty trash API failed:', e);
      }
      setTrashTransactions([]);
      showToast('Tempat sampah berhasil dikosongkan.', 'delete');
    } else if (deleteMode === 'goal' && goalToDelete) {
      const id = goalToDelete.id;
      const title = goalToDelete.title;
      try {
        const res = await fetch(`/api/goals?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
          const json = await res.json();
          if (json.goals) {
            setGoals(json.goals);
            storage.saveGoals(json.goals);
            showToast(`Target celengan "${title}" berhasil dihapus!`, 'delete');
            setGoalToDelete(null);
            setDeleteTargetId(null);
            return;
          }
        }
      } catch (e) {
        console.warn('Delete goal API failed:', e);
      }

      // Local fallback
      const remainingGoals = goals.filter((g) => g.id !== id);
      // If deleted goal was main, lock in the first remaining goal
      if (goalToDelete.isMain && remainingGoals.length > 0) {
        remainingGoals[0].isMain = true;
      }
      setGoals(remainingGoals);
      storage.saveGoals(remainingGoals);
      showToast(`Target celengan "${title}" berhasil dihapus!`, 'delete');
      setGoalToDelete(null);
    }

    setDeleteTargetId(null);
  };

  // Restore Transaction from Trash
  const handleRestoreTransaction = async (id: string) => {
    const targetTx = trashTransactions.find((tx) => tx.id === id);
    if (!targetTx) return;

    try {
      await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', id }),
      });
    } catch (e) {
      console.warn('Restore transaction API failed:', e);
    }

    setTrashTransactions((prev) => prev.filter((tx) => tx.id !== id));
    const restoredItem: Transaction = { ...targetTx, deletedAt: null };
    const updatedActive = [restoredItem, ...transactions];
    setTransactions(updatedActive);
    storage.saveTransactions(updatedActive);
    showToast(`Catatan "${targetTx.title}" berhasil dipulihkan!`, 'success');
  };

  // Open Edit Transaction Modal
  const handleOpenEditModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setAddTxType(tx.type);
    setIsAddTxOpen(true);
  };

  // Update Transaction in Database
  const handleUpdateTransaction = async (tx: Transaction) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx),
      });

      if (res.ok) {
        const json = await res.json();
        const updated = transactions.map((t) => (t.id === tx.id ? json.transaction : t));
        setTransactions(updated);
        storage.saveTransactions(updated);
        showToast(`Catatan "${tx.title}" berhasil diperbarui!`, 'edit');
        setEditingTransaction(null);
        return;
      }
    } catch (e) {
      console.warn('Update transaction API error:', e);
    }

    // Local fallback
    const updated = transactions.map((t) => (t.id === tx.id ? tx : t));
    setTransactions(updated);
    storage.saveTransactions(updated);
    showToast(`Catatan "${tx.title}" berhasil diperbarui!`, 'edit');
    setEditingTransaction(null);
  };

  // Open Manage Categories Modal
  const handleOpenManageCategories = (defaultType?: TransactionType) => {
    if (defaultType) {
      setManageCategoriesType(defaultType);
    }
    setIsManageCategoriesOpen(true);
  };

  // Add Custom Category
  const handleAddCustomCategory = async (name: string, type: TransactionType) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, type }),
      });
      if (res.ok) {
        const json = await res.json();
        const updated = [...customCategories, json.category];
        setCustomCategories(updated);
        storage.saveCategories(updated);
        showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
        return json.category.name;
      }
    } catch (e) {
      console.warn('Add category API error:', e);
    }

    // Local fallback
    const newCat: CustomCategory = {
      id: `cat-${Date.now()}`,
      name,
      type,
    };
    const updated = [...customCategories, newCat];
    setCustomCategories(updated);
    storage.saveCategories(updated);
    showToast(`Kategori "${name}" berhasil ditambahkan!`, 'success');
    return name;
  };

  // Update Custom Category
  const handleUpdateCustomCategory = async (id: string, name: string) => {
    const oldCat = customCategories.find((c) => c.id === id);
    const oldName = oldCat ? oldCat.name : '';

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      });
      if (res.ok) {
        const json = await res.json();
        const updatedCats = customCategories.map((c) => (c.id === id ? json.category : c));
        setCustomCategories(updatedCats);
        storage.saveCategories(updatedCats);

        // Update local transactions if category was renamed
        if (oldName) {
          const updatedTxs = transactions.map((t) => (t.category === oldName ? { ...t, category: name } : t));
          setTransactions(updatedTxs);
          storage.saveTransactions(updatedTxs);
        }

        showToast(`Kategori berhasil diubah menjadi "${name}"!`, 'edit');
        return;
      }
    } catch (e) {
      console.warn('Update category API error:', e);
    }

    // Local fallback
    const updatedCats = customCategories.map((c) => (c.id === id ? { ...c, name } : c));
    setCustomCategories(updatedCats);
    storage.saveCategories(updatedCats);
    if (oldName) {
      const updatedTxs = transactions.map((t) => (t.category === oldName ? { ...t, category: name } : t));
      setTransactions(updatedTxs);
      storage.saveTransactions(updatedTxs);
    }
    showToast(`Kategori berhasil diubah menjadi "${name}"!`, 'edit');
  };

  // Delete Custom Category
  const handleDeleteCustomCategory = async (id: string) => {
    const catToDelete = customCategories.find((c) => c.id === id);
    const catName = catToDelete ? catToDelete.name : 'Kategori';

    try {
      const res = await fetch(`/api/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const updated = customCategories.filter((c) => c.id !== id);
        setCustomCategories(updated);
        storage.saveCategories(updated);
        showToast(`Kategori "${catName}" berhasil dihapus.`, 'success');
        return;
      }
    } catch (e) {
      console.warn('Delete category API error:', e);
    }

    // Local fallback
    const updated = customCategories.filter((c) => c.id !== id);
    setCustomCategories(updated);
    storage.saveCategories(updated);
    showToast(`Kategori "${catName}" berhasil dihapus.`, 'success');
  };

  // Save Goal (Create or Update)
  const handleSaveGoal = async (data: {
    id?: string;
    title: string;
    targetAmount: number;
    currentAmount?: number;
    category?: string;
    isMain?: boolean;
  }) => {
    if (data.id) {
      // Edit existing goal
      try {
        const res = await fetch('/api/goals', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.goals) {
            setGoals(json.goals);
            storage.saveGoals(json.goals);
            showToast(`Target "${data.title}" berhasil diperbarui!`, 'edit');
            setEditingGoal(null);
            return;
          }
        }
      } catch (e) {
        console.warn('Edit goal API error:', e);
      }

      // Local fallback
      const updated = goals.map((g) =>
        g.id === data.id
          ? {
              ...g,
              title: data.title,
              targetAmount: data.targetAmount,
              currentAmount: data.currentAmount ?? g.currentAmount,
              category: data.category || g.category,
            }
          : g
      );
      setGoals(updated);
      storage.saveGoals(updated);
      showToast(`Target "${data.title}" berhasil diperbarui!`, 'edit');
      setEditingGoal(null);
    } else {
      // Create new goal
      try {
        const res = await fetch('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', ...data }),
        });

        if (res.ok) {
          const json = await res.json();
          const updated = json.goals || [...goals, json.goal];
          setGoals(updated);
          storage.saveGoals(updated);
          if (json.stats) {
            setStats(json.stats);
            storage.saveStats(json.stats);
          }
          showToast(`Target "${data.title}" tersimpan di database! +30 XP.`);
          return;
        }
      } catch (e) {
        console.warn('API error on addGoal:', e);
      }

      // Local fallback
      const xpReward = 30;
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount || 0,
        category: data.category || 'Target Impian',
        isMain: Boolean(data.isMain),
      };
      const updated = data.isMain
        ? [newGoal, ...goals.map((g) => ({ ...g, isMain: false }))]
        : [...goals, newGoal];
      setGoals(updated);
      storage.saveGoals(updated);
      gainXp(xpReward);
      showToast(`Target "${data.title}" berhasil dibuat! +${xpReward} XP.`);
    }
  };

  // Lock In Main Goal
  const handleLockInGoal = async (goalId: string) => {
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lock_in', id: goalId }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.goals) {
          setGoals(json.goals);
          storage.saveGoals(json.goals);
          const lockedGoal = json.goals.find((g: Goal) => g.id === goalId);
          showToast(`Target "${lockedGoal?.title || 'Goal'}" berhasil di-Lock In sebagai Target Utama!`, 'success');
          return;
        }
      }
    } catch (e) {
      console.warn('Lock in goal API error:', e);
    }

    // Local fallback
    const updated = goals.map((g) => ({
      ...g,
      isMain: g.id === goalId,
    }));
    // Reorder so main goal is first
    const sorted = [...updated].sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));
    setGoals(sorted);
    storage.saveGoals(sorted);
    const lockedGoal = sorted.find((g) => g.id === goalId);
    showToast(`Target "${lockedGoal?.title || 'Goal'}" berhasil di-Lock In sebagai Target Utama!`, 'success');
  };

  // Prompt Delete Goal
  const promptDeleteGoal = (goal: Goal) => {
    setGoalToDelete(goal);
    setDeleteMode('goal');
    setIsConfirmDeleteOpen(true);
  };

  // Open Edit Goal Modal
  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsAddGoalOpen(true);
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
    setEditingTransaction(null);
    setAddTxType(type);
    setIsAddTxOpen(true);
  };

  // Active Main Goal is the one marked with isMain: true, or the first goal
  const activeMainGoal = goals.find((g) => g.isMain) || goals[0] || {
    id: 'goal-default',
    title: 'Celengan Target',
    targetAmount: 5000000,
    currentAmount: 2500000,
    category: 'Target',
    isMain: true,
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setCurrentUser(null);
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      router.push('/login');
    }
  };

  return (
    <div className="bg-white min-h-screen w-full flex flex-col md:flex-row font-sans antialiased text-slate-800">
      
      {/* Custom Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Left Sidebar */}
      <LingoraSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={currentUser ? currentUser.username : stats.name}
        trashCount={trashTransactions.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenSettings={() => setIsAccountSettingsOpen(true)}
      />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-h-screen bg-white">
          
          {/* Top Stats Bar */}
          <LingoraTopBar
            streakDays={stats.streakDays}
            xpCoins={stats.currentXp}
          />

          {/* Main Dashboard Layout: Clean Single Column */}
          <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
              
              {activeTab === 'home' && (
                <>
                  {/* Hero Banner with Wallaby Mascot */}
                  <LingoraHeroBanner
                    userName={currentUser ? currentUser.username : stats.name}
                    onOpenAddModal={() => openAddModalWithType('expense')}
                  />

                  {/* Rangkuman Keuangan: Uang Dimiliki & Total Tabungan */}
                  <FinancialSummaryCards
                    totalBalance={totalIncome - totalExpense}
                    totalSavings={totalSavings}
                    onOpenAddTransaction={() => openAddModalWithType('expense')}
                    onOpenAddGoal={() => {
                      setEditingGoal(null);
                      setIsAddGoalOpen(true);
                    }}
                    onViewGoals={() => setActiveTab('goals')}
                  />

                  {/* Target Tabungan Utama */}
                  <FeaturedGoalCard
                    goal={activeMainGoal}
                    onTopUp={handleTopUpGoal}
                    onViewAllGoals={() => setActiveTab('goals')}
                  />

                  {/* Recent Transactions List */}
                  <TransactionsSection
                    transactions={transactions.slice(0, 6)}
                    onDelete={promptDeleteTransaction}
                    onEdit={handleOpenEditModal}
                    onOpenAddModal={openAddModalWithType}
                    searchQuery={searchQuery}
                    forcedType="all"
                    customCategories={customCategories}
                    onOpenManageCategories={() => handleOpenManageCategories('expense')}
                  />
                </>
              )}

              {activeTab === 'income' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        TOTAL PEMASUKAN
                      </span>
                      <h2 className="text-2xl font-black text-emerald-500 mt-0.5">
                        Rp {totalIncome.toLocaleString('id-ID')}
                      </h2>
                    </div>
                    <button
                      onClick={() => openAddModalWithType('income')}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
                    >
                      + PEMASUKAN
                    </button>
                  </div>

                  <TransactionsSection
                    transactions={transactions}
                    onDelete={promptDeleteTransaction}
                    onEdit={handleOpenEditModal}
                    onOpenAddModal={openAddModalWithType}
                    searchQuery={searchQuery}
                    forcedType="income"
                    customCategories={customCategories}
                    onOpenManageCategories={() => handleOpenManageCategories('income')}
                  />
                </div>
              )}

              {activeTab === 'expense' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-5 border-2 border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                        TOTAL PENGELUARAN
                      </span>
                      <h2 className="text-2xl font-black text-rose-500 mt-0.5">
                        Rp {totalExpense.toLocaleString('id-ID')}
                      </h2>
                    </div>
                    <button
                      onClick={() => openAddModalWithType('expense')}
                      className="px-4 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl border-b-4 border-rose-600 active:border-b-0 active:translate-y-1 transition cursor-pointer"
                    >
                      + PENGELUARAN
                    </button>
                  </div>

                  <TransactionsSection
                    transactions={transactions}
                    onDelete={promptDeleteTransaction}
                    onEdit={handleOpenEditModal}
                    onOpenAddModal={openAddModalWithType}
                    searchQuery={searchQuery}
                    forcedType="expense"
                    customCategories={customCategories}
                    onOpenManageCategories={() => handleOpenManageCategories('expense')}
                  />
                </div>
              )}

              {activeTab === 'goals' && (
                <GoalsManagerView
                  goals={goals}
                  onTopUp={handleTopUpGoal}
                  onOpenAddGoal={() => {
                    setEditingGoal(null);
                    setIsAddGoalOpen(true);
                  }}
                  onEditGoal={handleOpenEditGoal}
                  onDeleteGoal={promptDeleteGoal}
                  onLockInGoal={handleLockInGoal}
                />
              )}

              {activeTab === 'leaderboard' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-800">
                      Misi & Papan Skor
                    </h2>
                    <p className="text-xs font-bold text-slate-400">
                      Selesaikan misi harian dan raih peringkat teratas
                    </p>
                  </div>
                  <LingoraRightRail
                    streakDays={stats.streakDays}
                    dailyExpenseToday={35000}
                    dailyBudgetLimit={50000}
                  />
                </div>
              )}

              {activeTab === 'trash' && (
                <TrashView
                  trashItems={trashTransactions}
                  onRestore={handleRestoreTransaction}
                  onPermanentDelete={promptPermanentDelete}
                  onEmptyTrash={promptEmptyTrash}
                />
              )}

          </div>

        </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTransaction(null);
        }}
        onAddTransaction={handleAddTransaction}
        onUpdateTransaction={handleUpdateTransaction}
        editingTransaction={editingTransaction}
        initialType={addTxType}
        customCategories={customCategories}
        onOpenManageCategories={() => handleOpenManageCategories(addTxType)}
      />

      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        customCategories={customCategories}
        onAddCategory={handleAddCustomCategory}
        onUpdateCategory={handleUpdateCustomCategory}
        onDeleteCategory={handleDeleteCustomCategory}
        initialType={manageCategoriesType}
      />

      <GoalModal
        isOpen={isAddGoalOpen}
        onClose={() => {
          setIsAddGoalOpen(false);
          setEditingGoal(null);
        }}
        onSaveGoal={handleSaveGoal}
        editingGoal={editingGoal}
      />

      {/* Account Settings Modal (Change Username & Password) */}
      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={() => setIsAccountSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateSuccess={(updatedUser) => {
          setCurrentUser(updatedUser);
          showToast(`Akun berhasil diperbarui: @${updatedUser.username}!`, 'success');
        }}
      />

      {/* Custom Confirmation Modal (No Browser Confirm) */}
      <ConfirmDialogModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => {
          setIsConfirmDeleteOpen(false);
          setDeleteTargetId(null);
          setGoalToDelete(null);
        }}
        onConfirm={handleExecuteDelete}
        title={
          deleteMode === 'goal'
            ? 'Hapus Target Celengan?'
            : deleteMode === 'empty_trash'
            ? 'Kosongkan Tempat Sampah?'
            : deleteMode === 'permanent'
            ? 'Hapus Catatan Permanen?'
            : 'Pindahkan ke Tempat Sampah?'
        }
        message={
          deleteMode === 'goal'
            ? `Target celengan "${goalToDelete?.title}" akan dihapus dari daftar impianmu. Tindakan ini tidak dapat dibatalkan.`
            : deleteMode === 'empty_trash'
            ? 'Semua catatan di tempat sampah akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.'
            : deleteMode === 'permanent'
            ? 'Catatan keuangan ini akan dihapus secara permanen dari database. Tindakan ini tidak dapat dibatalkan.'
            : 'Catatan keuangan ini akan dipindahkan ke tempat sampah dan disimpan selama 30 hari sebelum terhapus secara otomatis.'
        }
        confirmLabel={
          deleteMode === 'goal'
            ? 'Ya, Hapus Target'
            : deleteMode === 'empty_trash'
            ? 'Ya, Kosongkan'
            : deleteMode === 'permanent'
            ? 'Ya, Hapus Permanen'
            : 'Pindahkan ke Sampah'
        }
        cancelLabel="Batal"
        type="danger"
      />

    </div>
  );
}
