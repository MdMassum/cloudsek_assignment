import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity'
import { Comment } from '../comments/entities/comment.entity'


export const getTypeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User,Post,Comment],
  synchronize: true,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,

});
