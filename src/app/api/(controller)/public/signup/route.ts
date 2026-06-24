import { NextResponse } from 'next/server';
import { validateRequest } from '@/app/api/(controller)/_util/validate';
import { checkRateLimit, getClientIp } from '@/app/api/(controller)/_util/rate-limiter';
import { signupSchema } from '@/app/api/model/request/auth/auth';
import { signupUser } from '@/app/service/auth/signup.service';
import { toUserResponse } from '@/app/api/model/response/auth';

export async function POST(request: Request) {
  try {
    // 1. Rate limit
    const ip = getClientIp(request);
    const rateLimitError = checkRateLimit(`signup:${ip}`, {
      maxRequests: 5,
      windowSeconds: 60,
    });
    if (rateLimitError) return rateLimitError;

    // 2. Validate
    const result = await validateRequest(request, signupSchema);
    if (result.error) return result.error;

    // 3. Signup
    const user = await signupUser(result.data);

    // 4. Return safe response
    return NextResponse.json(
      {
        success: true,
        message: 'Account created. Please check your email to verify your account.',
        user: toUserResponse(user),
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';

    // Duplicate email error
    if (message.includes('already exists')) {
      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    console.error('[SIGNUP ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
