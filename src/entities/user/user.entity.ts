import { Entity, Column } from 'typeorm';
import { UuidEntity } from 'src/core/database/typeorm/base.entity';
import { IdType } from './user.interface';

@Entity('user')
export class User extends UuidEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'enum', enum: IdType, name: 'id_type' })
  idType: IdType;

  @Column({ type: 'varchar', length: 255, name: 'id_value' })
  idValue: string;
}
