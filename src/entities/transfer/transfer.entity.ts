import { UuidEntity } from 'src/core/database/typeorm/base.entity';
import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { Quote } from '../quote/quote.entity';
import { plainToInstance } from 'class-transformer';

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
@Entity('transfer')
export class Transfer extends UuidEntity {
  @Column({ type: 'uuid', unique: true })
  quoteId: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.Transfers)
  @JoinColumn({ name: 'userId' })
  User: User;

  @OneToOne(() => Quote, (quote) => quote.Transfer)
  @JoinColumn({ name: 'quote_id' })
  Quote: Quote;

  static toEntity(plainTransfer: Partial<Transfer>) {
    return plainToInstance(Transfer, plainTransfer);
  }
}
