import { CustomRepository } from 'libs/common/typeorm.ex/typeorm-ex.decorator';
import { GenericTypeOrmRepository } from 'src/core/database/typeorm/generic-typeorm.repository';
import { Quote } from 'src/entities/quote/quote.entity';

@CustomRepository(Quote)
export class QuoteRepository extends GenericTypeOrmRepository<Quote> {}
