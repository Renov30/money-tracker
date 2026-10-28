import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { UserGender, UserRole } from '@/types';

// Helper: Ensure the caller is an authenticated admin
async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_session')?.value;
  if (!token) return null;

  const user = await db.getSessionUser(token);
  if (!user || user.role !== 'admin') return null;

  return user;
}

// GET: List all users (Admin only)
export async function GET() {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya admin yang diizinkan.' }, { status: 403 });
    }

    const users = await db.getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data akun pengguna' }, { status: 500 });
  }
}

// POST: Add new user via admin panel
export async function POST(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya admin yang diizinkan.' }, { status: 403 });
    }

    const body = await request.json();
    const { username, password, name, role, gender, age } = body;

    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Data username, password, dan nama wajib diisi.' }, { status: 400 });
    }

    const cleanUsername = username.trim().toLowerCase();
    const existing = await db.getUserByUsername(cleanUsername);
    if (existing) {
      return NextResponse.json({ error: 'Username sudah digunakan.' }, { status: 409 });
    }

    const passwordHash = hashPassword(password);
    const validRole: UserRole = role === 'admin' ? 'admin' : 'user';
    const validGender: UserGender = ['pria', 'wanita', 'other'].includes(gender) ? gender : 'pria';
    const parsedAge = parseInt(age, 10) || 20;

    const newUser = await db.createUser({
      id: `user-${Date.now()}`,
      username: cleanUsername,
      passwordHash,
      name: name.trim(),
      role: validRole,
      gender: validGender,
      age: parsedAge,
    });

    const allUsers = await db.getAllUsers();
    return NextResponse.json({ success: true, user: newUser, users: allUsers });
  } catch (error) {
    console.error('Admin users POST error:', error);
    return NextResponse.json({ error: 'Gagal menambahkan akun' }, { status: 500 });
  }
}

// PUT: Update user profile / role / password (Admin only)
export async function PUT(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya admin yang diizinkan.' }, { status: 403 });
    }

    const body = await request.json();
    const { id, name, role, gender, age, newPassword } = body;

    if (!id || !name) {
      return NextResponse.json({ error: 'ID dan nama lengkap wajib diisi.' }, { status: 400 });
    }

    const validRole: UserRole = role === 'admin' ? 'admin' : 'user';
    const validGender: UserGender = ['pria', 'wanita', 'other'].includes(gender) ? gender : 'pria';
    const parsedAge = parseInt(age, 10) || 20;

    const updatePayload: {
      id: string;
      name: string;
      role: UserRole;
      gender: UserGender;
      age: number;
      passwordHash?: string;
    } = {
      id,
      name: name.trim(),
      role: validRole,
      gender: validGender,
      age: parsedAge,
    };

    if (newPassword && newPassword.trim().length >= 6) {
      updatePayload.passwordHash = hashPassword(newPassword.trim());
    }

    const updatedUser = await db.updateUser(updatePayload);
    const allUsers = await db.getAllUsers();

    return NextResponse.json({ success: true, user: updatedUser, users: allUsers });
  } catch (error) {
    console.error('Admin users PUT error:', error);
    return NextResponse.json({ error: 'Gagal memperbarui akun' }, { status: 500 });
  }
}

// DELETE: Delete user (Admin only)
export async function DELETE(request: Request) {
  try {
    const admin = await checkAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: 'Akses ditolak: Hanya admin yang diizinkan.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID user wajib diberikan.' }, { status: 400 });
    }

    // Protect self-deletion
    if (admin.id === id) {
      return NextResponse.json({ error: 'Anda tidak dapat menghapus akun admin Anda sendiri saat sedang login.' }, { status: 400 });
    }

    await db.deleteUser(id);
    const allUsers = await db.getAllUsers();

    return NextResponse.json({ success: true, users: allUsers });
  } catch (error) {
    console.error('Admin users DELETE error:', error);
    return NextResponse.json({ error: 'Gagal menghapus akun pengguna' }, { status: 500 });
  }
}

