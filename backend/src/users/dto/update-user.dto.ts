import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @Optional()
  email?: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @Optional()
  username?: string;
}
