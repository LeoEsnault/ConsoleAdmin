import { NotFoundException } from '@nestjs/common';

export class RoleNotFoundException extends NotFoundException {
  constructor() {
    super("Rôle de l'utilisateur non trouvé");
  }
}
