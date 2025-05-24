import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentService {

  constructor(
    @InjectRepository(Comment)
    private commentRepo: Repository<Comment>,

    @InjectRepository(Post)
    private postRepo: Repository<Post>
  ) {}


  async create(dto: CreateCommentDto & { postId: string }, userId: string) {
  
    const post = await this.postRepo.findOneBy({ id: dto.postId });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const comment = this.commentRepo.create({
      ...dto,
      authorId: userId,
    });

    return this.commentRepo.save(comment);
  }


  async findOne(id: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author', 'post', 'replies', 'parentComment'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }


  async update(id: string, dto: UpdateCommentDto, userId: string) {
    const comment = await this.commentRepo.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can update only your comment !!');
    }

    await this.commentRepo.update(id, dto);
    return this.findOne(id);
  }


  async remove(id: string, userId: string) {
    const comment = await this.commentRepo.findOneBy({ id });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can delete only your comment !!');
    }

    await this.commentRepo.remove(comment);
    return { success: true, message: 'Comment deleted successfully' };
  }
}
