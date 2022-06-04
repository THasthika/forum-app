import { Exclude } from 'class-transformer';

export class CreateCommentDto {
  content: string;
  postId: string;
  @Exclude()
  authorId: string;
}
