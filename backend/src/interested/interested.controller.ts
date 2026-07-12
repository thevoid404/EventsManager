import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { MarkInterestedDto } from './dto/mark-interested.dto';
import { InterestedService } from './interested.service';

@Controller('events/:eventId/interested')
export class InterestedController {
  constructor(private readonly interestedService: InterestedService) {}

  @Post()
  markInterested(
    @Param('eventId') eventId: string,
    @Body() dto: MarkInterestedDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interestedService.markInterested(eventId, dto, user);
  }

  @Delete()
  removeInterest(
    @Param('eventId') eventId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.interestedService.removeInterest(eventId, user);
  }

  @Get()
  findByEvent(@Param('eventId') eventId: string) {
    return this.interestedService.findByEvent(eventId);
  }
}
