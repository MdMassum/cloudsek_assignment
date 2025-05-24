import { IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'new_username', description: 'New username' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ example: 'newpassword123', description: 'New password' })
  @IsOptional()
  @MinLength(6)
  password?: string;
}
