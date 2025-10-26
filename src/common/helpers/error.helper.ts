import { Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHelper {
  static caseErrorThrowError(error: Error | null) {
    if (error) {
      throw error;
    }
  }
}
