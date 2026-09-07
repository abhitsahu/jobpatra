import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const PUBLIC_URL = process.env.AWS_S3_PUBLIC_URL!;

const EXT_MAP: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/**
 * Returns a 5-minute pre-signed PUT URL for uploading a resume profile photo.
 * Key: resume_picture/{resumeId}/avatar.{ext} — always overwrites the previous photo.
 */
export async function getResumePhotoPresignedUrl(
  resumeId: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const ext = EXT_MAP[contentType] ?? 'jpg';
  const key = `resume_picture/${resumeId}/avatar.${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 s — browser PUT starts immediately
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return { uploadUrl, publicUrl };
}
