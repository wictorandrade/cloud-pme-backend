import { Request } from 'express';
import { UserPayload } from '@core/auth/auth.interfaces';

export interface CPMERequest extends Request {
  userPayload: UserPayload;
}
