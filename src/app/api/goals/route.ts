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
    };

    const saved = await db.addGoal(newGoal);

    // Award +30 XP
    const currentStats = await db.getStats();
    const updatedStats = await db.updateStats({
      ...currentStats,
      currentXp: currentStats.currentXp + 30,
    });

    return NextResponse.json({ goal: saved, stats: updatedStats });
  } catch (error) {
    console.error('Failed to update goals:', error);
    return NextResponse.json({ error: 'Failed to update goals' }, { status: 500 });
  }
}

