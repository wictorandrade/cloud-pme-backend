import { isEmail, registerDecorator, ValidationOptions } from 'class-validator';
import { isCPFOrCNPJ } from 'brazilian-values';

export function IsValidIdentity(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidIdentity',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return 'This value is not a valid identity.';
        },
        validate(value: any) {
          return (
            typeof value === 'string' && (isEmail(value) || isCPFOrCNPJ(value))
          );
        },
      },
    });
  };
}
