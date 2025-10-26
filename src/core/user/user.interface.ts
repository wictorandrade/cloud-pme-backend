import { UserGetPayload } from '@generated/prisma/models/User';

export type SecureUserReturn = UserGetPayload<{
  select: {
    id: true;
    displayName: true;
    firstName: true;
    lastName: true;
    googleId: true;
    email: true;
    avatarUrl: true;
    role: true;
  };
}>;
