import { Optional } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsEmail()
  @Optional()
  email?: string;

  @ApiPropertyOptional()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  @Optional()
  username?: string;
}
