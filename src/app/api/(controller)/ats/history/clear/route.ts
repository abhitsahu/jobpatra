/**
 * DELETE /api/ats/history/clear — Delete ALL analyses for the authenticated user.
 */

import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/(controller)/_util/auth-guard';
import { clearAllHistory } from '@/app/service/ats/history.service';

export async function DELETE() {
  try {
    const authResult = await requireAuth();
    if (authResult.error) return authResult.error;
    const userId = authResult.session!.user.id;

    await clearAllHistory(userId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/ats/history/clear]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to clear history' },
      { status: 500 },
    );
  }
}
