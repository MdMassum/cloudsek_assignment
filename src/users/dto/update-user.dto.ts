import { IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  
  @IsOptional()
  username?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

}