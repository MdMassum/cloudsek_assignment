import { IsEmail, MinLength, IsNotEmpty, IsOptional, IsIn } from 'class-validator';
import { UserRole } from 'src/users/dto/create-user.dto';

export class SignupDto {

  @IsEmail()
  email: string;

  @IsNotEmpty()
  username: string;

  @IsOptional()
  @IsIn(['user', 'admin'])
  role?: UserRole;

  @MinLength(6)
  password: string;
}
