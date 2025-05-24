import { IsEnum } from 'class-validator';
import { UserRole } from './create-user.dto';

export class UpdateRoleDto {

  @IsEnum(UserRole, { message: 'role must be one of: user, admin.' })
  role: UserRole;
}