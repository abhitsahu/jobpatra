import { NextResponse } from 'next/server';
import { requireAuth } from '@/app/api/(controller)/_util/auth-guard';
import { renderResumeHtml } from '@/app/service/resume/renderer.service';
import { generatePdf } from '@/app/service/resume/pdf.service';

type Params = { params: Promise<{ id: string }> };

// POST /api/resume/:id/pdf — returns PDF as octet-stream
import { prisma } from '@/app/_lib/prisma';
import { checkAndIncrementUsage, decrementUsage } from '@/app/service/subscription/usage.service';

export async function POST(_req: Request, { params }: Params) {
  let userId = '';
  let incremented = false;

  try {
    const { session, error } = await requireAuth();
    if (error) return error;
    userId = session!.user.id;

    // Check and increment usage limits for PDF downloads inside an explicit transaction
    await prisma.$transaction(async (tx) => {
      await checkAndIncrementUsage(tx, userId, 'DOWNLOAD_PDF');
    });
    incremented = true;

    const { id } = await params;
    const html = await renderResumeHtml(id, userId);
    const pdfBuffer = await generatePdf(html);

    // Convert Node Buffer → Uint8Array for Web API Response compatibility
    const body = new Uint8Array(pdfBuffer);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${id}.pdf"`,
        'Content-Length': body.length.toString(),
      },
    });
  } catch (err) {
    if (incremented && userId) {
      try {
        await prisma.$transaction(async (tx) => {
          await decrementUsage(tx, userId, 'DOWNLOAD_PDF');
        });
      } catch (refundErr) {
        console.error('Failed to refund PDF usage:', refundErr);
      }
    }

    if (err instanceof Error && (err as any).code === 'LIMIT_EXCEEDED') {
      return NextResponse.json(
        { success: false, message: err.message },
        { status: 403 }
      );
    }

    const message = err instanceof Error ? err.message : 'Failed to generate PDF';
    if (message === 'Resume not found') {
      return NextResponse.json({ success: false, message }, { status: 404 });
    }
    console.error('[POST /api/resume/:id/pdf]', err);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
