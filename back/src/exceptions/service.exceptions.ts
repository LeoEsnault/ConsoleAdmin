import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

export class InvalidServiceDataException extends BadRequestException {
  constructor() {
    super('Les données du service sont invalides ou manquantes.');
  }
}

export class DatabaseQueryServiceException extends InternalServerErrorException {
  constructor(error: any) {
    super(`Erreur lors de la vérification du service: ${error.message}`);
  }
}

export class ServiceAlreadyExistsException extends ConflictException {
  constructor() {
    super('Un service avec ce nom existe déjà.');
  }
}

export class ServiceCreationException extends BadRequestException {
  constructor() {
    super('Erreur lors de la création du service.');
  }
}

export class ServiceNotFoundException extends NotFoundException {
  constructor() {
    super('Service(s) non trouvé(s)');
  }
}

export class ServiceUpdateException extends BadRequestException {
  constructor(error?: any, message?: string) {
    super(error, message ?? 'Erreur lors de la mise à jour du service');
  }
}

export class ServiceDeleteException extends InternalServerErrorException {
  constructor() {
    super('Erreur lors de la suppression du service.');
  }
}
