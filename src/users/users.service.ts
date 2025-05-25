import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationOptions, IPaginationResult } from '../common/interfaces/pagination.interface';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private redisService: RedisService,
  ) {}

  // create user service
  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }


  async findAll(options: IPaginationOptions): Promise<IPaginationResult<User>> {

    const cacheKey = `users:page=${options.page}:limit=${options.limit}`;
    const cached = await this.redisService.get<IPaginationResult<User>>(cacheKey);
    if (cached) return cached;

    const [items, total] = await this.userRepo.findAndCount({
      where:{role:UserRole.USER},
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });
    
    const result = { items, total, page: options.page, limit: options.limit };
    await this.redisService.set(cacheKey, result, 60);
    return result;
  }


  async findByEmail(email: string) {

    const cacheKey = `user:email:${email}`;
    const cached = await this.redisService.get<User>(cacheKey);
    if (cached) return cached;
  
    const user = await this.userRepo.findOne({ where: { email } });
    if (user) await this.redisService.set(cacheKey, user, 120);

    return user;
  }


  async findByUsername(username: string) {

    const cacheKey = `user:username:${username}`;
    const cached = await this.redisService.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepo.findOne({ where: { username } });
    if (user) await this.redisService.set(cacheKey, user, 120);

    return user;
  }


  async findOne(id: string): Promise<User> {

    const cacheKey = `user:id:${id}`;
    const cached = await this.redisService.get<User>(cacheKey);
    if (cached) return cached;

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    
    await this.redisService.set(cacheKey, user, 120);
    return user;
  }


  async update(id: string, dto: UpdateUserDto): Promise<{ success: boolean, message: string, data: User }> {

    await this.userRepo.update(id, dto);

    // Invalidating all related caches
    await this.redisService.del(`user:id:${id}`);
    if (dto.username) await this.redisService.del(`user:username:${dto.username}`);
    await this.redisService.delPattern(`users:*`);

    const user = await this.findOne(id);
    return { success: true, message: 'User updated successfully', data: user };
  }


  async updateRole(id:string, role:UserRole):Promise<{ success: boolean, message: string, data: User }> {
    
    await this.userRepo.update(id, {role});

    // invalidating cache
    await this.redisService.del(`user:id:${id}`);
    await this.redisService.delPattern(`users:*`);

    const user = await this.findOne(id);
    return { success: true, message: 'User updated successfully', data: user };
  }


  async remove(id: string): Promise<{ success:boolean, message: string }> {

    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.userRepo.delete(id);

    // invalidating all related caches
    await this.redisService.del(`user:id:${id}`);
    await this.redisService.del(`user:email:${user.email}`);
    await this.redisService.del(`user:username:${user.username}`);
    await this.redisService.delPattern(`users:*`);

    return { success: true, message: 'User deleted successfully' };
  }
  
} 