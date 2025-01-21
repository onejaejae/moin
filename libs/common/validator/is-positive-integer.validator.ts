import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

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
          return Number.isInteger(value) && value > 0;
        },
      },
    });
  };
}
