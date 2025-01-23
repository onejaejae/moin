import { Quote } from 'src/entities/quote/quote.entity';
import { User } from 'src/entities/user/user.entity';
import { TransferRepository } from 'src/modules/transfer/repository/transfer.repository';

export class TransferFactory {
  static async createTransfer(
    userId: User['id'],
    quoteId: Quote['id'],
    transferRepository: TransferRepository,
  ) {
    const transfer = transferRepository.create({
      userId,
      quoteId,
    });

    return transferRepository.save(transfer);
  }
}
