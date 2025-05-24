import {
  Controller, Get, Body, Param, Put, Delete, Request, UseGuards, Post as HttpPost, Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('/api/v1/posts')
export class PostController {
  constructor(private postService: PostService) {}

  // create post
  @HttpPost('/create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  create(@Request() req, @Body() dto: CreatePostDto) {
    return this.postService.create(dto, req.user.userId);
  }

  // find all posts
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all posts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Posts fetched successfully.' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.postService.findAll({ page: +page, limit: +limit });
  }

  // get my posts
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get posts created by logged-in user' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'User posts fetched successfully.' })
  findMyPosts(
    @Request() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.postService.findMyPosts(req.user.userId, {
      page: Number(page),
      limit: Number(limit),
    });
  }

  // get post by id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  // update my post
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post by ID (owner only)' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not the owner.' })
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Request() req) {
    return this.postService.update(id, dto, req.user.userId);
  }

  // delete my post
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post by ID (owner only)' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Not the owner.' })
  remove(@Param('id') id: string, @Request() req) {
    return this.postService.remove(id, req.user.userId);
  }
}