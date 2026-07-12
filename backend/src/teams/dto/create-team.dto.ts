import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(2)
  @Max(20)
  maxMembers: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  lookingFor: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  whatsapp: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  facebook: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  discord?: string;
}
