import { UserRole } from '@generated/prisma/enums';

export interface JwtFields {
  sub: string;
  aud: string;
  nbf: number;
  iss: string;
  type: 'access' | 'refresh';
}

export interface JwtSignedFields extends JwtFields, UserPayload {}

export interface JwtUnsignedFields
  extends UserPayload,
    Pick<JwtFields, 'sub' | 'type'> {}

export interface UserPayload {
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface UserDetails {
  email: string;
  displayName: string;
}
