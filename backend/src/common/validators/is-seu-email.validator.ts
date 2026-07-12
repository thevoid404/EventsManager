import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SEU_EMAIL_DOMAIN } from '../constants';

@ValidatorConstraint({ name: 'isSeuEmail', async: false })
export class IsSeuEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string): boolean {
    return (
      typeof email === 'string' &&
      email.toLowerCase().endsWith(SEU_EMAIL_DOMAIN)
    );
  }

  defaultMessage(): string {
    return `Email must be a valid ${SEU_EMAIL_DOMAIN} address`;
  }
}

export function IsSeuEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSeuEmailConstraint,
    });
  };
}
