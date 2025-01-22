import { Quote } from 'src/entities/quote/quote.entity';

export interface IQuoteStrategy {
  makeQuote(userId: string, amount: number): Promise<Partial<Quote>>;
}
