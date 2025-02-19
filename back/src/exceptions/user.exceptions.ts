import { NotFoundException } from "@nestjs/common";

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super("Utilisateur(s) non trouvé(s)");
  }
}

export class ProfileNotFoundException extends NotFoundException {
  constructor() {
    super("Profil(s) non trouvé(s)");
  }
}
