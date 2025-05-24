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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comments')
@Controller('/api/v1/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  // Create comment on a post
  @HttpPost('/new/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiParam({ name: 'postId', description: 'UUID of the post' })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({ status: 201, description: 'Comment created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(
    @Param('postId') postId: string,
    @Request() req,
    @Body() dto: CreateCommentDto,
  ) {
    if (!postId) {
      throw new BadRequestException('Invalid postId');
    }
    return this.commentService.create({ ...dto, postId }, req.user.userId);
  }

  // Get comment by ID
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get comment by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the comment' })
  @ApiResponse({ status: 200, description: 'Comment fetched successfully.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  // Update comment — only by owner
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update comment by ID (only owner)' })
  @ApiParam({ name: 'id', description: 'UUID of the comment' })
  @ApiBody({ type: UpdateCommentDto })
  @ApiResponse({ status: 200, description: 'Comment updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only owner can update.' })
  async update(@Param('id') id: string, @Request() req, @Body() dto: UpdateCommentDto) {
    return this.commentService.update(id, dto, req.user.userId);
  }

  // Delete comment — only by owner
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment by ID (only owner)' })
  @ApiParam({ name: 'id', description: 'UUID of the comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden. Only owner can delete.' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.commentService.remove(id, req.user.userId);
  }
}
