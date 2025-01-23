import { Entity, Column, OneToMany } from 'typeorm';
import { UuidEntity } from 'src/core/database/typeorm/base.entity';
import { IdType } from './user.interface';
import { Quote } from '../quote/quote.entity';
import { Transfer } from '../transfer/transfer.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User extends UuidEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  userId: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: IdType, name: 'id_type' })
  idType: IdType;

  @Column({ type: 'varchar', length: 255, name: 'id_value' })
  idValue: string;

  @OneToMany(() => Quote, (quote) => quote.User)
  Quotes: Quote[];

  @OneToMany(() => Transfer, (transfer) => transfer.User)
  Transfers: Transfer[];
}
