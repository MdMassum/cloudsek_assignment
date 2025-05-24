import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'User role',
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: UserRole;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}