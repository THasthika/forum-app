import { PostStatus } from '../post.entity';

export class UpdatePostStatusDto {
  id: string;
  status: PostStatus;
  checkerId: string;
}
