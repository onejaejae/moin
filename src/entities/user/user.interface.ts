import { Union } from 'src/common/type/common.interface';

export const IdType = {
  RegNo: 'REG_NO',
  BusinessNo: 'BUSINESS_NO',
} as const;
export type IdType = Union<typeof IdType>;
