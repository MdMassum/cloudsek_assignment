import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './create-user.dto';

export class UpdateRoleDto {
  @ApiProperty({ example: 'admin', enum: UserRole, description: 'New user role' })
  @IsEnum(UserRole, { message: 'role must be one of: user, admin.' })
  role: UserRole;
}
