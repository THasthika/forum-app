import { NotFoundException } from '@nestjs/common';

export class CommentNotFoundException extends NotFoundException {
  constructor() {
    super('Comment Not Found');
  }
}
