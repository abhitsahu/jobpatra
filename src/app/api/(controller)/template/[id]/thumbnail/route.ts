import fs from 'fs';
import path from 'path';
import { getTemplate } from '@/app/service/resume/template.service';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    // Decode template ID (e.g. if nested under categories like 'classic/classic-01')
    const decodedId = decodeURIComponent(id);
    const template = getTemplate(decodedId);

    if (!template.thumbnailPath || !fs.existsSync(template.thumbnailPath)) {
      return new Response('Thumbnail not found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(template.thumbnailPath);
    const ext = path.extname(template.thumbnailPath).toLowerCase();
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[GET /api/template/[id]/thumbnail]', err);
    return new Response('Error loading thumbnail', { status: 500 });
  }
}
