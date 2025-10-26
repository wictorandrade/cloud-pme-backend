import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@generated/prisma/enums';

export const ROLES_USER_KEY = 'roles_user';

export type MetadataUserRoles = {
  UserCityRoles?: UserRole[];
};

export const CityRoles = (userCityRoles?: UserRole[]) => {
  const metadata: MetadataUserRoles = {
    UserCityRoles: userCityRoles,
  };

  return applyDecorators(
    SetMetadata(ROLES_USER_KEY, metadata),
    ApiResponse({
      description: `User City Roles: ${JSON.stringify(metadata)}`,
    }),
  );
};
