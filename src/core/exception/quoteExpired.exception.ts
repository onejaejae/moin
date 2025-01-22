import { UnprocessableEntityException } from '@nestjs/common';

export class QuoteExpiredException extends UnprocessableEntityException {
  constructor() {
    super('QUOTE_EXPIRED');
  }
}
