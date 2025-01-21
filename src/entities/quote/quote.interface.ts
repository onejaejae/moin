import { Union } from 'src/common/type/common.interface';

export const QuoteTargetCurrency = {
  Usd: 'USD',
  Jpy: 'JPY',
} as const;
export type QuoteTargetCurrency = Union<typeof QuoteTargetCurrency>;
