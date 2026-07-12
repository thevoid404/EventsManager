import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJoinRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  introduction: string;
}
