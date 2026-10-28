import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Goal } from '@/types';

export async function GET() {
  try {
    const goals = await db.getGoals();
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Failed to get goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'lock_in') {
      const { id } = body;
      await db.lockInMainGoal(id);
      const updatedGoals = await db.getGoals();
      return NextResponse.json({ goals: updatedGoals });
    }

    if (body.action === 'topup') {
      const { id, amount } = body;
      await db.topUpGoal(id, Number(amount));

      // Award XP
      const currentStats = await db.getStats();
      const updatedStats = await db.updateStats({
        ...currentStats,
        currentXp: currentStats.currentXp + 25,
      });

      const updatedGoals = await db.getGoals();
      return NextResponse.json({ goals: updatedGoals, stats: updatedStats });
    }

    // Default: create new goal
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: body.title,
      targetAmount: Number(body.targetAmount),
      currentAmount: 0,
      category: body.category || 'Target Impian',
      isMain: Boolean(body.isMain),
    };

    const saved = await db.addGoal(newGoal);

    // Award +30 XP
    const currentStats = await db.getStats();
    const updatedStats = await db.updateStats({
      ...currentStats,
      currentXp: currentStats.currentXp + 30,
    });

    const updatedGoals = await db.getGoals();
    return NextResponse.json({ goal: saved, goals: updatedGoals, stats: updatedStats });
  } catch (error) {
    console.error('Failed to update goals:', error);
    return NextResponse.json({ error: 'Failed to update goals' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, targetAmount, currentAmount, category } = body;

    const updatedGoal: Goal = {
      id,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      category: category || 'Target Impian',
    };

    await db.updateGoal(updatedGoal);
    const updatedGoals = await db.getGoals();
    return NextResponse.json({ goal: updatedGoal, goals: updatedGoals });
  } catch (error) {
    console.error('Failed to update goal:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const success = await db.deleteGoal(id);
    const updatedGoals = await db.getGoals();
    return NextResponse.json({ success, goals: updatedGoals });
  } catch (error) {
    console.error('Failed to delete goal:', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}

