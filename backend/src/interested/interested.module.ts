import { Module } from '@nestjs/common';
import { InterestedController } from './interested.controller';
import { InterestedService } from './interested.service';

@Module({
  controllers: [InterestedController],
  providers: [InterestedService],
  exports: [InterestedService],
})
export class InterestedModule {}
