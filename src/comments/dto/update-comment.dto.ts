import { IsArray, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ example: 'Updated comment content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ type: [String], description: 'Updated mentions list' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];
}
