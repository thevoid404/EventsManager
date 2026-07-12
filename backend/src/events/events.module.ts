import { Module } from '@nestjs/common';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { AuthModule } from '../auth/auth.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [AuthModule],
  controllers: [EventsController],
  providers: [EventsService, OptionalJwtAuthGuard],
  exports: [EventsService],
})
export class EventsModule {}
