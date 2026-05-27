import { successResponse, errorResponse } from '@/lib/responses';
import { getCurrentSession, deleteSession, clearSessionCookie } from '@/lib/session';

export async function POST() {
  try {
    const session = getCurrentSession();
    if (session) {
      deleteSession(session.id);
    }
    clearSessionCookie();

    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    return errorResponse(error);
  }
}
