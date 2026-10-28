import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Transaction } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isTrash = searchParams.get('trash') === 'true';

    if (isTrash) {
      const trashItems = await db.getTrashTransactions();
      return NextResponse.json(trashItems);
    }

    const transactions = await db.getTransactions();
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Action: Restore from trash
    if (body.action === 'restore') {
      if (!body.id) {
        return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
      }
      await db.restoreTransaction(body.id);
      return NextResponse.json({ success: true, id: body.id, action: 'restore' });
    }

    // 2. Action: Empty all trash
    if (body.action === 'empty_trash') {
      await db.emptyTrash();
      return NextResponse.json({ success: true, action: 'empty_trash' });
    }

    // 3. Normal create transaction
    const xpReward = 25;
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: body.title,
      amount: Number(body.amount),
      type: body.type,
      category: body.category,
      date: body.date || new Date().toISOString().split('T')[0],
      xpEarned: xpReward,
    };

    const saved = await db.addTransaction(newTx);

    // Also increment user XP
    const currentStats = await db.getStats();
    let newXp = currentStats.currentXp + xpReward;
    let newLevel = currentStats.level;
    let newTitle = currentStats.title;

    if (newXp >= currentStats.xpToNextLevel) {
      newLevel += 1;
      newXp = newXp - currentStats.xpToNextLevel;
      newTitle = `Pengatur Bijak (Level ${newLevel})`;
    }

    const updatedStats = await db.updateStats({
      ...currentStats,
      level: newLevel,
      currentXp: newXp,
      title: newTitle,
    });

    return NextResponse.json({ transaction: saved, stats: updatedStats });
  } catch (error) {
    console.error('Failed to create/handle transaction:', error);
    return NextResponse.json({ error: 'Failed to handle transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const updatedTx: Transaction = {
      id: body.id,
      title: body.title,
      amount: Number(body.amount),
      type: body.type,
      category: body.category,
      date: body.date || new Date().toISOString().split('T')[0],
      xpEarned: Number(body.xpEarned) || 25,
    };

    const saved = await db.updateTransaction(updatedTx);
    return NextResponse.json({ transaction: saved });
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const isPermanent = searchParams.get('permanent') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    if (isPermanent) {
      await db.permanentDeleteTransaction(id);
      return NextResponse.json({ success: true, id, permanent: true });
    } else {
      await db.deleteTransaction(id);
      return NextResponse.json({ success: true, id, permanent: false });
    }
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

