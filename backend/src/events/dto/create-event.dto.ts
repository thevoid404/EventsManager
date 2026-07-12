import { EventCategory, EventType } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  description: string;

  @IsDateString()
  registrationDeadline: string;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsUrl()
  registrationLink?: string;
}
