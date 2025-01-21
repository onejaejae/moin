import { UuidEntity } from 'src/core/database/typeorm/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { QuoteTargetCurrency } from './quote.interface';
import { User } from '../user/user.entity';
import { Transfer } from '../transfer/transfer.entity';

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

  @Column({ type: 'int', unsigned: true })
  sourceAmount: number;

  @Column({ type: 'int', unsigned: true })
  fee: number;

  @Column({ type: 'int', unsigned: true })
  usdExchangeRate: number;

  @Column({ type: 'int', unsigned: true })
  usdAmount: number;

  @Column({ type: 'enum', enum: QuoteTargetCurrency })
  targetCurrency: QuoteTargetCurrency;

  @Column({ type: 'int', unsigned: true })
  exchangeRate: number;

  @Column({ type: 'int', unsigned: true })
  targetAmount: number;

  @Column('timestamptz')
  expireTime: Date;

  @ManyToOne(() => User, (user) => user.Quotes)
  @JoinColumn({ name: 'user_id' })
  User: User;

  @OneToOne(() => Transfer)
  @JoinColumn({ name: 'quoteId' })
  Transfer: Transfer;
}
