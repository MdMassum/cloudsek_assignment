import {
  Controller, Get, Body, Param, Put, Delete, Request, UseGuards, Post as HttpPost, Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('/api/v1/posts')
export class PostController {
  constructor(private postService: PostService) {}

  // create post
  @HttpPost('/create')  
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreatePostDto) {
    return this.postService.create(dto, req.user.userId);
  }


  // find all posts
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postService.findAll({ page: +page, limit: +limit });
  }

  // get my posts
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  findMyPosts(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postService.findMyPosts(req.user.userId, { page: Number(page), limit: Number(limit) });
  }

  // get post by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  // update my post
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Request() req) {
    return this.postService.update(id, dto, req.user.userId);
  }

  // delete my post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req) {
    return this.postService.remove(id, req.user.userId);
  }
}
