import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'My awesome post', description: 'Title of the post' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is the content of my post', description: 'Post content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ type: [String], description: 'Optional list of user IDs mentioned in the post' })
  @IsOptional()
  @IsArray()
  mentions?: string[];
}
