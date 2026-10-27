import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Transaction } from '@/types';

export async function GET() {
  try {
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
    console.error('Failed to create transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    await db.deleteTransaction(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}

