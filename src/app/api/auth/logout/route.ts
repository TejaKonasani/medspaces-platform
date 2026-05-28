import { successResponse, errorResponse } from '@/lib/responses';
import { getCurrentSessionAsync, deleteSession, clearSessionCookie, clearSessionRoleCookie } from '@/lib/session';

export async function POST() {
  try {
    const session = await getCurrentSessionAsync();
    if (session) {
      await deleteSession(session.id);
    }
    clearSessionCookie();
    clearSessionRoleCookie();

    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
