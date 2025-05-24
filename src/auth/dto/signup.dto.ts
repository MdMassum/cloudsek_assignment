import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, MinLength, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { UserRole } from 'src/users/dto/create-user.dto';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe', description: 'Username' })
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'Role of the user',
    enum: ['user', 'admin'],
  })
  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: UserRole;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @MinLength(6)
  password: string;
}