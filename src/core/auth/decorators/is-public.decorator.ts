import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const IS_PUBLIC_KEY = 'isPublic';

export const IsPublic = () => {
  return applyDecorators(
    SetMetadata(IS_PUBLIC_KEY, true),
    ApiResponse({ description: 'used when route is public.' }),
  );
};
