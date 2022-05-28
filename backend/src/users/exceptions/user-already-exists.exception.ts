import { BadRequestException } from '@nestjs/common';

export class UserAlreadyExistsException extends BadRequestException {
  constructor() {
    super('User Already Exists');
  }
}
