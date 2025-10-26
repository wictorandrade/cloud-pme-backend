import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserAlredyHasAccountException extends BadRequestException {
  constructor() {
    super(`O usuario já tem uma conta.`);
  }
}

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User Not Found Exception');
  }
}

export class DisplayNameAlreadyTakenException extends BadRequestException {
  constructor() {
    super('Este nome de usuário já está em uso.');
  }
}
