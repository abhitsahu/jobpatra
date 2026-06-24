import { hash } from 'bcryptjs';
import { prisma } from '@/app/_lib/prisma';

/**
 * Reset password service — consumes a PasswordResetToken and updates password.
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // 1. Find the token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error('Invalid or expired reset token');
  }

  // 2. Check expiration
  if (new Date() > resetToken.expires) {
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    throw new Error('Reset token has expired. Please request a new one.');
  }

  // 3. Hash new password
  const password = await hash(newPassword, 12);

  // 4. Update password + 5. Delete token in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { email: resetToken.email },
      data: { password },
    });

    // Delete ALL reset tokens for this email
    await tx.passwordResetToken.deleteMany({
      where: { email: resetToken.email },
    });
  });
}
