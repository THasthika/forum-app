import { Exclude } from 'class-transformer';

export class CreatePostDto {
  title: string;
  content: string;
  @Exclude()
  authorId: string;
}
