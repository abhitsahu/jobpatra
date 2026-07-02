import { NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/(controller)/_util/validate';
import { requireAuth } from '@/app/api/(controller)/_util/auth-guard';
import { createResumeSchema, listResumesQuerySchema } from '@/app/api/model/request/resume/resume';
import { createResume, listResumes } from '@/app/service/resume/resume.service';
import { toResumeDetail } from '@/app/api/model/response/resume';

// POST /api/resume — create a new resume
export async function POST(req: Request) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const result = await validateRequest(req, createResumeSchema);
    if (result.error) return result.error;

    const resume = await createResume(session!.user.id, result.data);

    return NextResponse.json({ success: true, data: toResumeDetail(resume) }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/resume]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to create resume' },
      { status: 500 },
    );
  }
}

// GET /api/resume — list user's resumes (paginated)
export async function GET(req: Request) {
  try {
    const { session, error } = await requireAuth();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const queryResult = listResumesQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid query parameters' },
        { status: 400 },
      );
    }

    const result = await listResumes(session!.user.id, queryResult.data);

    return NextResponse.json({
      success: true,
      // Inline map to match Prisma select shape (not full Resume model)
      data: result.data.map((r) => ({
        id: r.id,
        title: r.title,
        templateId: r.templateId,
        status: r.status,
        pdfUrl: r.pdfUrl,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    console.error('[GET /api/resume]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to list resumes' },
      { status: 500 },
    );
  }
}
