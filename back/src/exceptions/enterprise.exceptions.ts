import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

export class EnterpriseNotFoundException extends NotFoundException {
  constructor() {
    super('Erreur lors de la récupération de l’entreprise');
  }
}
