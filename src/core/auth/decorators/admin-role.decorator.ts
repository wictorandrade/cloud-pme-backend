import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ROLES_USER_KEY = 'roles_user';

export type MetadataAdminRoute = {
  isAdminRoute: boolean;
};

export const AdminRoute = (isAdminRoute: boolean = true) => {
  const metadata: MetadataAdminRoute = { isAdminRoute };

  return applyDecorators(
    SetMetadata(ROLES_USER_KEY, metadata),
    ApiResponse({
      description: `Admin Guard Route ${JSON.stringify(metadata)}`,
    }),
  );
};
