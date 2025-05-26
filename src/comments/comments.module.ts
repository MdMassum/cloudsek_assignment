import { Module } from '@nestjs/common';
import { CommentService } from './comments.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { KafkaModule } from 'src/kafka/kafka.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Comment,Post,User]),
    KafkaModule
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentsModule {}