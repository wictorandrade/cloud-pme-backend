import { Request } from 'express';
import { UserPayload } from '@core/auth/auth.interfaces';

export interface EcoaRequest extends Request {
  userPayload: UserPayload;
}
