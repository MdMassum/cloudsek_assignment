import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Put,
  Delete,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('/api/v1/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  // Create comment on a post
  @HttpPost('/new/:postId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('postId') postId: string,
    @Request() req,
    @Body() dto: CreateCommentDto
  ) {
    
    if (!postId) {
      throw new BadRequestException('Invalid postId');
    }
    return this.commentService.create({ ...dto, postId }, req.user.userId);
  }

  // Get comment by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  // Update comment — only by owner
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Request() req, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto, req.user.userId);
  }

  // Delete comment — only by owner
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(id, req.user.userId);
  }
}
