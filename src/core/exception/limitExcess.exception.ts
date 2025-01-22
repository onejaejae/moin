import { UnprocessableEntityException } from '@nestjs/common';

export class LimitExcessException extends UnprocessableEntityException {
  constructor() {
    super('LIMIT_EXCESS');
  }
}
