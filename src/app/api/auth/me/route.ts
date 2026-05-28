import { successResponse, errorResponse } from '@/lib/responses';
import { AppError } from '@/lib/errors';
import { getCurrentSessionAsync, setSessionRoleCookie } from '@/lib/session';
import { usersRepository } from '@/lib/repositories/users.repository';
import { getPermissionsForRole } from '@/lib/auth/permissions';

export async function GET() {
  try {
    const session = await getCurrentSessionAsync();
    if (!session) throw AppError.unauthorized('Not authenticated');

    const user = await usersRepository.findById(session.userId);
    if (!user) throw AppError.unauthorized('User not found');

    setSessionRoleCookie(user.role);
    const permissions = getPermissionsForRole(user.role as any);

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone ?? null,
        specialty: user.specialty ?? null,
        city: user.city ?? null,
      },
      permissions,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
