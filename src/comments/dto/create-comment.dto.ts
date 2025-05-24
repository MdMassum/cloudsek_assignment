import { IsNotEmpty, IsUUID, IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ type: [String], description: 'User mentions in the comment' })
  @IsOptional()
  @IsArray()
  mentions?: string[];

  @ApiPropertyOptional({ example: 'uuid-of-parent-comment', description: 'Parent comment ID if this is a reply' })
  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
