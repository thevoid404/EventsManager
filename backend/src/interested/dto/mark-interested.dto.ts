import { IsOptional, IsString, MaxLength } from 'class-validator';

export class MarkInterestedDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  interestText?: string;
}
