import { Transform } from 'class-transformer';

export function ToLowercase(): PropertyDecorator {
  return Transform(({ value }) => (value ? value.toLowerCase() : value));
}
