import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

export class EnterpriseNotFoundException extends NotFoundException {
  constructor(error?: any) {
    const errorMessages = new Map([
      ['PGRST116', "L'entreprise n'existe pas"],
      ['22P02', "L'id de l'entreprise est incorrecte"],
    ]);

    const message =
      error && errorMessages.has(error.code)
        ? errorMessages.get(error.code)
        : "Erreur lors de la récupération de l'entreprise";

    super(message);
  }
}
