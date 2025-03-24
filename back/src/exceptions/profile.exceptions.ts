import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

export class ProfileNotFoundException extends NotFoundException {
  constructor(error?: any, message?: string) {
    super(error, message ?? 'Erreur dans la récupération du(des) profil(s)');
  }
}

export class ProfileCreationException extends InternalServerErrorException {
  constructor() {
    super('Erreur lors de la création du profil');
  }
}

export class ProfileUpdateException extends BadRequestException {
  constructor(error?: any, message?: string) {
    super(error, message ?? 'Erreur lors de la mise à jour du profil');
  }
}

