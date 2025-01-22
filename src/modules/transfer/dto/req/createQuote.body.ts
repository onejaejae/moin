import { IsEnum } from 'class-validator';
import { IsPositiveInteger } from 'libs/common/validator/is-positive-integer.validator';
import { QuoteTargetCurrency } from 'src/entities/quote/quote.interface';

export class CreateQuoteBody {
  @IsPositiveInteger()
  amount: number;

  @IsEnum(QuoteTargetCurrency)
  targetCurrency: QuoteTargetCurrency;
}
