import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { CustomCategory } from '@/types';

export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to get categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const newCat: CustomCategory = {
      id: `cat-${Date.now()}`,
      name: body.name.trim(),
      type: body.type || 'expense',
    };

    const saved = await db.addCategory(newCat);
    return NextResponse.json({ category: saved });
  } catch (error) {
    console.error('Failed to create category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    await db.deleteCategory(id);
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Failed to delete category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
