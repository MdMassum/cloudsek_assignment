import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationOptions, IPaginationResult } from '../common/interfaces/pagination.interface';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // create user service
  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }


  async findAll(options: IPaginationOptions): Promise<IPaginationResult<User>> {
    const [items, total] = await this.userRepo.findAndCount({
      where:{role:UserRole.USER},
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });
    return { items, total, page: options.page, limit: options.limit };
  }


  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }


  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }


  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }


  async update(id: string, dto: UpdateUserDto): Promise<{ success: boolean, message: string, data: User }> {
    await this.userRepo.update(id, dto);
    const user = await this.findOne(id);
    return { success: true, message: 'User updated successfully', data: user };
  }


  async updateRole(id:string, role:UserRole):Promise<{ success: boolean, message: string, data: User }> {
    console.log(role)
    await this.userRepo.update(id, {role});
    const user = await this.findOne(id);
    return { success: true, message: 'User updated successfully', data: user };
  }


  async remove(id: string): Promise<{ success:boolean, message: string }> {
    const res = await this.userRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('User not found');
    return {success:true, message: 'User deleted successfully' };
  }
  
} 