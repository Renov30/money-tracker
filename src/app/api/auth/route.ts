import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword, generateSessionToken } from '@/lib/auth';
import { UserGender, UserRole } from '@/types';

// GET: Current user session info
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_session')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const user = await db.getSessionUser(token);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching auth state:', error);
    return NextResponse.json({ user: null });
  }
}

// POST: Register or Login or Logout
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    const cookieStore = await cookies();

    // ACTION: LOGOUT
    if (action === 'logout') {
      const token = cookieStore.get('auth_session')?.value;
      if (token) {
        await db.deleteSession(token);
      }
      cookieStore.delete('auth_session');
      return NextResponse.json({ success: true });
    }

    // ACTION: REGISTER
    if (action === 'register') {
      const { username, password, name, gender, age } = body;

      if (!username || !password || !name) {
        return NextResponse.json(
          { error: 'Username, password, dan nama lengkap wajib diisi.' },
          { status: 400 }
        );
      }

      const cleanUsername = username.trim().toLowerCase();
      if (cleanUsername.length < 3) {
        return NextResponse.json(
          { error: 'Username minimal 3 karakter alfanumerik.' },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password minimal 6 karakter.' },
          { status: 400 }
        );
      }

      const validGender: UserGender = ['pria', 'wanita', 'other'].includes(gender) ? gender : 'pria';
      const parsedAge = parseInt(age, 10);
      if (!parsedAge || parsedAge < 5 || parsedAge > 120) {
        return NextResponse.json(
          { error: 'Mohon masukkan usia yang valid (5 - 120 tahun).' },
          { status: 400 }
        );
      }

      // Check existing username
      const existing = await db.getUserByUsername(cleanUsername);
      if (existing) {
        return NextResponse.json(
          { error: 'Username sudah digunakan, silakan pilih username lain.' },
          { status: 409 }
        );
      }

      const passwordHash = hashPassword(password);
      const newUser = await db.createUser({
        id: `user-${Date.now()}`,
        username: cleanUsername,
        passwordHash,
        name: name.trim(),
        role: 'user',
        gender: validGender,
        age: parsedAge,
      });

      if (!newUser) {
        return NextResponse.json(
          { error: 'Gagal membuat akun, silakan coba lagi.' },
          { status: 500 }
        );
      }

      // Create 30-day session
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await db.createSession(token, newUser.id, expiresAt);

      cookieStore.set('auth_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
      });

      return NextResponse.json({ success: true, user: newUser });
    }

    // ACTION: LOGIN
    if (action === 'login') {
      const { username, password } = body;

      if (!username || !password) {
        return NextResponse.json(
          { error: 'Username dan password wajib diisi.' },
          { status: 400 }
        );
      }

      const cleanUsername = username.trim().toLowerCase();
      const userWithHash = await db.getUserByUsername(cleanUsername);

      if (!userWithHash) {
        return NextResponse.json(
          { error: 'Username atau password salah.' },
          { status: 401 }
        );
      }

      const isValid = verifyPassword(password, userWithHash.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Username atau password salah.' },
          { status: 401 }
        );
      }

      // Create 30-day session
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await db.createSession(token, userWithHash.id, expiresAt);

      cookieStore.set('auth_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: expiresAt,
      });

      const { passwordHash: _, ...authUser } = userWithHash;
      return NextResponse.json({ success: true, user: authUser });
    }

    // ACTION: UPDATE PROFILE (Change username / password)
    if (action === 'update_profile') {
      const token = cookieStore.get('auth_session')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Sesi login tidak valid' }, { status: 401 });
      }

      const currentUser = await db.getSessionUser(token);
      if (!currentUser) {
        return NextResponse.json({ error: 'Pengguna tidak ditemukan' }, { status: 401 });
      }

      const { newUsername, newPassword, currentPassword } = body;

      // Verify current password first
      const userRecord = await db.getUserByUsername(currentUser.username);
      if (!userRecord) {
        return NextResponse.json({ error: 'Akun tidak ditemukan' }, { status: 404 });
      }

      if (!currentPassword || !verifyPassword(currentPassword, userRecord.passwordHash)) {
        return NextResponse.json(
          { error: 'Password saat ini salah. Konfirmasi password saat ini diperlukan untuk menyimpan perubahan.' },
          { status: 400 }
        );
      }

      let targetUsername = currentUser.username;
      if (newUsername && newUsername.trim().toLowerCase() !== currentUser.username.toLowerCase()) {
        const clean = newUsername.trim().toLowerCase();
        if (clean.length < 3) {
          return NextResponse.json({ error: 'Username minimal 3 karakter.' }, { status: 400 });
        }
        // Check uniqueness
        const exist = await db.getUserByUsername(clean);
        if (exist && exist.id !== currentUser.id) {
          return NextResponse.json({ error: 'Nama akun/username ini sudah digunakan oleh pengguna lain.' }, { status: 409 });
        }
        targetUsername = clean;
      }

      let newPasswordHash: string | undefined = undefined;
      if (newPassword && newPassword.trim().length > 0) {
        if (newPassword.trim().length < 6) {
          return NextResponse.json({ error: 'Password baru minimal 6 karakter.' }, { status: 400 });
        }
        newPasswordHash = hashPassword(newPassword.trim());
      }

      const updated = await db.updateUser({
        id: currentUser.id,
        username: targetUsername,
        name: currentUser.name,
        role: currentUser.role,
        gender: currentUser.gender,
        age: currentUser.age,
        passwordHash: newPasswordHash,
      });

      return NextResponse.json({ success: true, user: updated });
    }

    return NextResponse.json({ error: 'Aksi auth tidak valid' }, { status: 400 });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan sistem saat proses otentikasi.' }, { status: 500 });
  }
}

