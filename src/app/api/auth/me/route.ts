import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { getCurrentSession } from '@/lib/session';
import { userStore } from '@/lib/auth/users';
import { getPermissionsForRole } from '@/lib/auth/permissions';

export async function GET() {
  try {
    const session = getCurrentSession();
    if (!session) {
      throw AppError.unauthorized('Not authenticated');
    }

    const storedUser = userStore.findById(session.userId);
    if (!storedUser) {
      throw AppError.unauthorized('User not found');
    }

    const user = userStore.getPublicUser(storedUser);
    const permissions = getPermissionsForRole(user.role);

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      permissions,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
