import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  // create post service
  async create(dto: CreatePostDto, userId: string) {
    const post = this.postRepo.create({ ...dto, authorId: userId });
    return await this.postRepo.save(post);
  }


  // find all post service
  async findAll(options: IPaginationOptions): Promise<IPaginationResult<Post>> {

    const [items, total] = await this.postRepo.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { createdAt: 'DESC' },
      relations: ['author', 'comments'],
    });
    
    return { items, total, page: options.page, limit: options.limit };
  }


  // find my posts
  async findMyPosts(userId: string, options: IPaginationOptions): Promise<IPaginationResult<Post>> {

    const [items, total] = await this.postRepo.findAndCount({
      where: { authorId: userId },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { createdAt: 'DESC' },
      relations: ['author', 'comments'],
    });

    return { items, total, page: options.page, limit: options.limit };
  }


  // find posts by id
  async findOne(id: string) {
    const post = await this.postRepo.findOne({ where: { id }, relations: ['author', 'comments'] });
    if (!post) throw new NotFoundException('Post not found');

    return post;
  }


  // update my posts only
  async update(id: string, dto: UpdatePostDto, userId: string) {

    const post = await this.postRepo.findOneBy({ id });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You can update only your comment !!');

    await this.postRepo.update(id, dto);
    const updatedpost = await this.findOne(id);

    return {success:true, message:"post updated successfully",post:updatedpost}
  }


  // delete my posts only 
  async remove(id: string, userId: string) {

    const post = await this.postRepo.findOneBy({ id });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You can delete only your post !!');

    await this.postRepo.remove(post);
    return { success: true, message: 'Post deleted successfully' };
  }
}
