import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistsException extends BadRequestException {
  constructor() {
    super('Email Already Exists');
  }
}
