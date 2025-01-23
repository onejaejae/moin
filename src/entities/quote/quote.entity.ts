import { UuidEntity } from 'src/core/database/typeorm/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { QuoteTargetCurrency } from './quote.interface';
import { User } from '../user/user.entity';
import { Transfer } from '../transfer/transfer.entity';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { DecimalTransformer } from 'src/core/database/typeorm/transformer/decimal.transformer';

/**
 * 환전 견적 엔티티
 * @property sourceAmount 원화 금액
 * @property fee 수수료
 * @property usdExchangeRate 환전 환율
 * @property usdAmount usd 금액
 * @property targetCurrency 받는 환율 정보
 * @property exchangeRate 교환 환율
 * @property targetAmount 받는 금액
 * @property expireTime 만료 시간
 */
@Entity('quote')
export class Quote extends UuidEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, unsigned: true })
  sourceAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, unsigned: true })
  fee: number;

  @Column({ type: 'decimal', precision: 10, scale: 4, unsigned: true })
  usdExchangeRate: number;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 4,
    unsigned: true,
    transformer: new DecimalTransformer(),
  })
  usdAmount: number;

  @Column({ type: 'enum', enum: QuoteTargetCurrency })
  targetCurrency: QuoteTargetCurrency;

  @Column({ type: 'decimal', precision: 10, scale: 4, unsigned: true })
  exchangeRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, unsigned: true })
  targetAmount: number;

  @Column('timestamptz')
  expiredAt: Date;

  @ManyToOne(() => User, (user) => user.Quotes)
  @JoinColumn({ name: 'user_id' })
  User: User;

  @OneToOne(() => Transfer, (transfer) => transfer.Quote)
  @JoinColumn({ name: 'quoteId' })
  Transfer: Transfer;

  static toEntity(plainQuote: Partial<Quote>) {
    return plainToInstance(Quote, plainQuote);
  }

  isExpired(): boolean {
    return dayjs().isAfter(this.expiredAt);
  }
}
