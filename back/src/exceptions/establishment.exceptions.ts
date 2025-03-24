import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

export class InvalidEstablishmentDataException extends BadRequestException {
  constructor() {
    super('Les données de l’établissement sont invalides ou manquantes.');
  }
}

export class DatabaseQueryException extends InternalServerErrorException {
  constructor(error: any) {
    super(`Erreur lors de la vérification de l'établissement: ${error.message}`);
  }
}

export class EstablishmentAlreadyExistsException extends ConflictException {
  constructor() {
    super('Un établissement avec ce nom existe déjà.');
  }
}

export class EstablishmentCreationException extends BadRequestException {
  constructor() {
    super('Erreur lors de la création de l’établissement.');
  }
}

export class EstablishmentNotFoundException extends NotFoundException {
  constructor() {
    super('Établissement(s) non trouvé(s)');
  }
}

export class EstablishmentUpdateException extends BadRequestException {
  constructor(error?: any, message?: string) {
    super(error, message ?? "Erreur lors de la mise à jour de l'établissement");
  }
}

export class EstablishmentDeleteException extends InternalServerErrorException {
  constructor() {
    super("Erreur lors de la suppression de l'établissement.");
  }
}
