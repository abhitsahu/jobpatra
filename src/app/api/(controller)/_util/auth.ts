import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/(controller)/auth/[...nextauth]/options';

/**
 * Get the authenticated session for a server-side request.
 *
 * Usage in API routes:
 *
 *   const session = await getAuthSession();
 *   if (!session) {
 *     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
 *   }
 */
export async function getAuthSession() {
  return await getServerSession(authOptions);
}

/**
 * Guard helper — returns 401 if no session exists.
 *
 * Usage:
 *
 *   const result = await requireAuth();
 *   if (result.error) return result.error;
 *   const session = result.session;
 */
export async function requireAuth(): Promise<
  | { session: Awaited<ReturnType<typeof getAuthSession>>; error?: never }
  | { session?: never; error: NextResponse }
> {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { session };
}

/**
 * Admin guard — returns 403 if user is not an admin.
 */
export async function requireAdmin(): Promise<
  | { session: Awaited<ReturnType<typeof getAuthSession>>; error?: never }
  | { session?: never; error: NextResponse }
> {
  const authResult = await requireAuth();
  if (authResult.error) return authResult;

  if (authResult.session?.user?.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 }),
    };
  }

  return { session: authResult.session };
}
