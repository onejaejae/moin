import { UnprocessableEntityException } from '@nestjs/common';

export class NegativeNumberException extends UnprocessableEntityException {
  constructor() {
    super('NEGATIVE_NUMBER');
  }
}
