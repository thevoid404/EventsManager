import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { CreateJoinRequestDto } from './dto/create-join-request.dto';
import { CreateTeamDto } from './dto/create-team.dto';
import { TeamsService } from './teams.service';

@Controller('events/:eventId/teams')
export class EventTeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  findByEvent(
    @Param('eventId') eventId: string,
    @Req() req: { user?: AuthenticatedUser },
  ) {
    return this.teamsService.findByEvent(eventId, req.user);
  }

  @Post()
  create(
    @Param('eventId') eventId: string,
    @Body() dto: CreateTeamDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.create(eventId, dto, user);
  }
}

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':teamId')
  findOne(
    @Param('teamId') teamId: string,
    @Req() req: { user?: AuthenticatedUser },
  ) {
    return this.teamsService.findOne(teamId, req.user);
  }

  @Post(':teamId/join-requests')
  createJoinRequest(
    @Param('teamId') teamId: string,
    @Body() dto: CreateJoinRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.createJoinRequest(teamId, dto, user);
  }

  @Get(':teamId/join-requests')
  getJoinRequests(
    @Param('teamId') teamId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.getJoinRequests(teamId, user);
  }

  @Patch(':teamId/join-requests/:requestId/accept')
  acceptJoinRequest(
    @Param('teamId') teamId: string,
    @Param('requestId') requestId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.acceptJoinRequest(teamId, requestId, user);
  }

  @Patch(':teamId/join-requests/:requestId/reject')
  rejectJoinRequest(
    @Param('teamId') teamId: string,
    @Param('requestId') requestId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.rejectJoinRequest(teamId, requestId, user);
  }
}
