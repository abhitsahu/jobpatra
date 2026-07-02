import { NextResponse } from 'next/server';
import { listTemplates } from '@/app/service/resume/template.service';

// GET /api/template — list all available templates
export async function GET() {
  try {
    const templates = listTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (err) {
    console.error('[GET /api/template]', err);
    return NextResponse.json(
      { success: false, message: 'Failed to list templates' },
      { status: 500 },
    );
  }
}
