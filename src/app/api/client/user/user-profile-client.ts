import { apiFetch } from '@/app/api/client/_utils/api-client';
import type { UpdateUserMetaDTO } from '@/app/api/model/request/user/user-profile';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  jobTitle: string | null;
  industry: string | null;
  /** ID of the reserved profile resume — used to load/save all career sections */
  profileResumeId: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/user/profile
// Returns user meta + profileResumeId without creating any data.
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserProfileClient(): Promise<UserProfile> {
  const res = await apiFetch<ApiResponse<UserProfile>>('/api/user/profile');
  return res.data;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/user/profile
// Updates basic user meta: name, jobTitle, industry, image.
// Career section data is saved via updateResumeClient(profileResumeId, ...).
// ─────────────────────────────────────────────────────────────────────────────

export async function updateUserMetaClient(data: UpdateUserMetaDTO): Promise<UserProfile> {
  const res = await apiFetch<ApiResponse<UserProfile>>('/api/user/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}
