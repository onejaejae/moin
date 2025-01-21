import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { NegativeNumberException } from 'src/core/exception/negativeNumber.exception';

export function IsPositiveInteger(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPositiveInteger',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'NEGATIVE_NUMBER',
        ...validationOptions,
      },
      validator: {
        validate(value: any, _args: ValidationArguments) {
          const isValid = Number.isInteger(value) && value > 0;
          if (!isValid) {
            throw new NegativeNumberException();
          }
          return isValid;
        },
      },
    });
  };
}
