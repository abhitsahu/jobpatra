// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload/resume-photo — Response Model
// ─────────────────────────────────────────────────────────────────────────────

export interface PresignedUrlResponseDTO {
  success: boolean;
  uploadUrl: string;
  publicUrl: string;
  message?: string;
}
