import path from 'path';
import fs from 'fs';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateMetadata {
  id: string;
  name: string;
  category: string;
  version: string;
  thumbnail: string;
  engine: string;
  ats: boolean;
  sections: string[];
  slug?: string;
  description?: string;
  previewImage?: string;
  atsFriendly?: boolean;
  isPremium?: boolean;
  usageCount?: number;
}

export interface TemplateInfo extends TemplateMetadata {
  hbsPath: string;
  cssPath: string;
  thumbnailPath: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE REGISTRY — scanned from filesystem at runtime
// ─────────────────────────────────────────────────────────────────────────────

const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

function registerTemplate(registry: Map<string, TemplateInfo>, dir: string, dirName: string): void {
  const metaPath = path.join(dir, 'metadata.json');
  if (!fs.existsSync(metaPath)) return;

  try {
    const meta: TemplateMetadata = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    registry.set(meta.id, {
      ...meta,
      hbsPath: path.join(dir, 'template.hbs'),
      cssPath: path.join(dir, 'style.css'),
      thumbnailPath: path.join(dir, meta.thumbnail),
    });
  } catch {
    console.warn(`[template.service] Failed to parse metadata for template: ${dirName}`);
  }
}

function scanTemplates(): Map<string, TemplateInfo> {
  const registry = new Map<string, TemplateInfo>();

  if (!fs.existsSync(TEMPLATES_DIR)) return registry;

  const topLevel = fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const entry of topLevel) {
    const entryPath = path.join(TEMPLATES_DIR, entry.name);
    const metaPath = path.join(entryPath, 'metadata.json');

    if (fs.existsSync(metaPath)) {
      // Flat structure: src/templates/<id>/metadata.json
      registerTemplate(registry, entryPath, entry.name);
    } else {
      // Category structure: src/templates/<category>/<id>/metadata.json
      const subDirs = fs
        .readdirSync(entryPath, { withFileTypes: true })
        .filter((d) => d.isDirectory());

      for (const sub of subDirs) {
        const subPath = path.join(entryPath, sub.name);
        registerTemplate(registry, subPath, `${entry.name}/${sub.name}`);
      }
    }
  }

  return registry;
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export function listTemplates(): TemplateInfo[] {
  return Array.from(scanTemplates().values());
}

export function getTemplate(templateId: string): TemplateInfo {
  const registry = scanTemplates();
  let template = registry.get(templateId);
  if (!template) {
    // Graceful fallback to classic-demo or first template
    template = registry.get('classic-demo') || Array.from(registry.values())[0];
  }
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }
  return template;
}

export function validateTemplateExists(templateId: string): boolean {
  return scanTemplates().has(templateId);
}
