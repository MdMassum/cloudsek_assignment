import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { KafkaModule } from 'src/kafka/kafka.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Post,User]),
    KafkaModule
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostsModule {}