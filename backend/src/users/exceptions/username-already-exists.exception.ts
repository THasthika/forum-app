import { BadRequestException } from '@nestjs/common';

export class UsernameAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Username Already Exists');
  }
}
