import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const stats = await db.getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Failed to get user stats:', error);
    return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await db.updateStats(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update user stats:', error);
    return NextResponse.json({ error: 'Failed to update user stats' }, { status: 500 });
  }
}

