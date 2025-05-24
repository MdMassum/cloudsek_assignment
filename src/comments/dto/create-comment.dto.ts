import { IsNotEmpty, IsUUID, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateCommentDto {

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsArray()
  mentions?: string[];

  @IsOptional()
  @IsUUID()
  parentCommentId?: string;
}
