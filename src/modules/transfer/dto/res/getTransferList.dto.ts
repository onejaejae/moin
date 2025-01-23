import { Transfer } from 'src/entities/transfer/transfer.entity';
import dayjs from 'dayjs';
import { OmitNotJoinedProps } from 'src/core/database/typeorm/typeorm.interface';

type TTransferWithQuote = OmitNotJoinedProps<
  Transfer,
  {
    Quote: true;
  }
>;

export class TransferHistoryResponseDto {
  sourceAmount: number;
  fee: number;
  usdExchangeRate: number;
  usdAmount: number;
  targetCurrency: string;
  exchangeRate: number;
  targetAmount: number;
  requestedDate: string;

  static fromQuote(transfer: TTransferWithQuote): TransferHistoryResponseDto {
    const dto = new TransferHistoryResponseDto();
    const quote = transfer.Quote;

    dto.sourceAmount = quote.sourceAmount;
    dto.fee = quote.fee;
    dto.usdExchangeRate = quote.usdExchangeRate;
    dto.usdAmount = quote.usdAmount;
    dto.targetCurrency = quote.targetCurrency;
    dto.exchangeRate = quote.exchangeRate;
    dto.targetAmount = quote.targetAmount;
    dto.requestedDate = dayjs(transfer.createdAt).format('YYYY-MM-DD HH:mm:ss');

    return dto;
  }
}

export class TransferSummaryResponseDto {
  userId: string;
  name: string;
  todayTransferCount: number;
  todayTransferUsdAmount: number;
  history: TransferHistoryResponseDto[];

  static fromUserAndTransfers(
    user: {
      id: string;
      name: string;
    },
    transfers: TTransferWithQuote[],
  ): TransferSummaryResponseDto {
    const dto = new TransferSummaryResponseDto();
    const today = dayjs().toDate();

    dto.userId = user.id;
    dto.name = user.name;

    // 오늘 날짜의 송금 내역만 필터링
    const todayTransfers = transfers.filter((transfer) =>
      dayjs(transfer.createdAt).isSame(today, 'day'),
    );

    dto.todayTransferCount = todayTransfers.length;
    dto.todayTransferUsdAmount = todayTransfers.reduce(
      (sum, transfer) => sum + transfer.Quote.usdAmount,
      0,
    );

    // 전체 송금 내역을 DTO로 변환
    dto.history = transfers
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((transfer) => TransferHistoryResponseDto.fromQuote(transfer));

    return dto;
  }
}
