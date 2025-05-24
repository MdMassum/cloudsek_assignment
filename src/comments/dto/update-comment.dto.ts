import { IsArray, IsOptional, IsString } from "class-validator";

export class UpdateCommentDto {

  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mentions?: string[];

}
  