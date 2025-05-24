import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
  
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return user;
    }
    return null;
  }

  // login service
  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // signup service
  async signup(dto: SignupDto) {

    const [existingEmailUser, existingUsernameUser] = await Promise.all([
      this.usersService.findByEmail(dto.email),
      this.usersService.findByUsername(dto.username),
    ]);
  
    if (existingEmailUser) {
      throw new BadRequestException('Email already exists');
    }
    if (existingUsernameUser) {
      throw new BadRequestException('Username already exists');
    }
  
    const hash = await bcrypt.hash(dto.password, 10);
  
    const user = await this.usersService.create({
      email: dto.email,
      username: dto.username,
      role: dto.role,
      password: hash,
    });
  
    const { password, ...result } = user;
    return result;
  }

  // change password
  async changePassword(userId: string, oldPassword: string, newPassword: string) {

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect current password');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    return this.usersService.update(userId, { password: newHashedPassword });
  }

  // logout user
  async logout(user: any) {
    return { success : true, message: 'Successfully logged out' };
  }
}
