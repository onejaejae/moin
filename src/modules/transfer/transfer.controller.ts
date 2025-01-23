import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TransferService } from './service/transfer.service';
import { CreateQuoteBody } from './dto/req/createQuote.body';
import { AccessTokenGuard } from 'src/core/guard/accessToken.guard';
import { RequestedUser } from 'src/core/decorator/user.decorator';
import { User } from 'src/entities/user/user.entity';
import { RequestTransferBody } from './dto/req/requestTransfer.body';
import { TransferSummaryResponseDto } from './dto/res/getTransferList.dto';

@UseGuards(AccessTokenGuard)
@Controller('transfer')
export class TransferController {
  constructor(private readonly service: TransferService) {}

  @Get('/list')
  async getTransferList(@RequestedUser() user: User) {
    const res = await this.service.getTransferList(user.id);

    return TransferSummaryResponseDto.fromUserAndTransfers(
      {
        id: res.id,
        name: res.name,
      },
      res.Transfers,
    );
  }

  @Post('/quote')
  async createQuote(
    @RequestedUser() user: User,
    @Body() body: CreateQuoteBody,
  ) {
    return this.service.createQuote(user.id, body);
  }

  @Post('/request')
  async requestTransfer(
    @RequestedUser() user: User,
    @Body() body: RequestTransferBody,
  ) {
    await this.service.requestTransfer(user.id, user.idType, body.quoteId);
  }
}
