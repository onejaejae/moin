import { OmitNotJoinedProps } from 'src/core/database/typeorm/typeorm.interface';
import { User } from 'src/entities/user/user.entity';

export type TTransferList = OmitNotJoinedProps<
  User,
  {
    Transfers: {
      Quote: true;
    };
  }
>;
