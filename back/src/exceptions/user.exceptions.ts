import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('Utilisateur(s) non trouvé(s)');
  }
}

export class ProfileNotFoundException extends NotFoundException {
  constructor(error?: any, message?: string) {
    super(error, message ?? 'Erreur dans la récupération du(des) profil(s)');
  }
}

export class UserCreationException extends BadRequestException {
  constructor() {
    super('Erreur lors de la création de l’utilisateur');
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

export class UserAlreadyExistsException extends ConflictException {
  constructor() {
    super('Un utilisateur avec cette adresse e-mail existe déjà.');
  }
}

export class InvalidEmailFormatException extends BadRequestException {
  constructor() {
    super("L'adresse e-mail fournie n'est pas valide.");
  }
}

export class InvalidUserDataException extends BadRequestException {
  constructor() {
    super('Les données de l’utilisateur sont invalides ou manquantes.');
  }
}

export class UserDeleteException extends InternalServerErrorException {
  constructor(message = "Erreur lors de la suppression de l'user.") {
    super(message);
  }
}

export class SuperAdminDeleteException extends BadRequestException {
  constructor(message = 'Interdit de supprimer un super_admin.') {
    super(message);
  }
}

export class DatabaseException extends InternalServerErrorException {
  constructor(message = 'Erreur de base de données.') {
    super(message);
  }
}
