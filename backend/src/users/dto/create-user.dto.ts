import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
