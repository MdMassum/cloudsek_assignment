import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IPaginationOptions, IPaginationResult } from 'src/common/interfaces/pagination.interface';
import { RedisService } from 'src/redis/redis.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    private redisService: RedisService,
    private kafkaProducerService:KafkaProducerService
  ) {}

  // create post service
  async create(dto: CreatePostDto, userId: string) {

    const post = this.postRepo.create({ ...dto, authorId: userId });
    const saved =  await this.postRepo.save(post);

    // invalidating pagination cache
    await this.redisService.delPattern(`posts:*`);
    await this.redisService.delPattern(`myposts:user=${userId}:*`);

    // Notify author that post is created
    await this.kafkaProducerService.sendMessage('notify-user', {
      userId, 
      content: {
        type: 'post',
        message: `New post created: "${post.title}"`,
        postId: post.id,
      },
    });

    return saved;
  }


  // find all post service
  async findAll(options: IPaginationOptions): Promise<IPaginationResult<Post>> {

    const cacheKey = `posts:page=${options.page}:limit=${options.limit}`;
    const cached = await this.redisService.get<IPaginationResult<Post>>(cacheKey);
    if (cached) return cached;

    const [items, total] = await this.postRepo.findAndCount({
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { createdAt: 'DESC' },
      relations: ['author', 'comments'],
    });

    const result = { items, total, page: options.page, limit: options.limit };
    await this.redisService.set(cacheKey, result, 60); // cache for 60 seconds
    return result;
    
  }


  // find my posts
  async findMyPosts(userId: string, options: IPaginationOptions): Promise<IPaginationResult<Post>> {

    const cacheKey = `myposts:user=${userId}:page=${options.page}:limit=${options.limit}`;
    const cached = await this.redisService.get<IPaginationResult<Post>>(cacheKey);
    if (cached) return cached;

    const [items, total] = await this.postRepo.findAndCount({
      where: { authorId: userId },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
      order: { createdAt: 'DESC' },
      relations: ['author', 'comments'],
    });

    const result = { items, total, page: options.page, limit: options.limit };
    await this.redisService.set(cacheKey, result, 60); // cache for 60 seconds
    return result;
  }


  // find posts by id
  async findOne(id: string) {

    const cacheKey = `post:${id}`;
    const cached = await this.redisService.get<Post>(cacheKey);
    if (cached) return cached;

    const post = await this.postRepo.findOne({ where: { id }, relations: ['author', 'comments'] });
    if (!post) throw new NotFoundException('Post not found');

    await this.redisService.set(cacheKey, post, 120);
    return post;
  }


  // update my posts only
  async update(id: string, dto: UpdatePostDto, userId: string) {

    const post = await this.postRepo.findOneBy({ id });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You can update only your comment !!');

    await this.postRepo.update(id, dto);

    // invalidating cache
    await this.redisService.del(`post:${id}`);   
    await this.redisService.delPattern(`posts:*`);
    await this.redisService.delPattern(`myposts:user=${userId}:*`);

    // Notify author that post has been updated
    await this.kafkaProducerService.sendMessage('notify-user', {
      userId, 
      content: {
        type: 'post-update',
        message: `Post has been Updated: "${post.title}"`,
        postId: post.id,
      },
    });

    const updatedpost = await this.findOne(id);

    return {success:true, message:"post updated successfully",post:updatedpost}
  }


  // delete my posts only 
  async remove(id: string, userId: string) {

    const post = await this.postRepo.findOneBy({ id });

    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('You can delete only your post !!');

    await this.postRepo.remove(post);

    // invalidating cache
    await this.redisService.del(`post:${id}`);   
    await this.redisService.delPattern(`posts:*`);
    await this.redisService.delPattern(`myposts:user=${userId}:*`);

    // Notify author that post has been updated
    await this.kafkaProducerService.sendMessage('notify-user', {
      userId, 
      content: {
        type: 'post-delete',
        message: `${post.title} Post has been Deleted Successfully"`,
      },
    });

    return { success: true, message: 'Post deleted successfully' };
  }
}
