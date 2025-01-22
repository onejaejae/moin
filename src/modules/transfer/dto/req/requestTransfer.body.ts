import { IsUUID } from 'class-validator';
import { Quote } from 'src/entities/quote/quote.entity';

export class RequestTransferBody {
  @IsUUID()
  quoteId: Quote['id'];
}
