import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventTeamsController, TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [NotificationsModule],
  controllers: [EventTeamsController, TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
