import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export class CreateUserDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: UserRole;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
  
}