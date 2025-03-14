import { Injectable } from '@nestjs/common';
import { ProfilFacade } from './profil.facade';
import * as Exceptions from '../exceptions';

@Injectable()
export class ProfilService {
  constructor(private readonly profilFacade: ProfilFacade) {}

  async getUserProfile(userId: string) {
    try {
      return await this.profilFacade.getUserProfile(userId);
    } catch (error) {
      console.error('Erreur dans lors de la récupération du profil utilisateur:', error);
      throw new Exceptions.ProfileNotFoundException(
        error,
        `Erreur dans lors de la récupération du profil utilisateur ${userId}`
      );
    }
  }

  async updateUserProfile(userId: string, data: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[1-9]\d{1,14}$/;
    const { phone, email, firstname, lastname } = data;

    if (lastname && lastname.length > 40) {
      throw new Exceptions.InvalidFormatException('Le nom fourni est trop long ou contient des caractères invalides.');
    }
    if (firstname && firstname.length > 40) {
      throw new Exceptions.InvalidFormatException(
        'Le prénom fourni est trop long ou contient des caractères invalides.'
      );
    }
    if (phone && (typeof phone !== 'string' || phone.length > 20 || !phoneRegex.test(phone))) {
      throw new Exceptions.InvalidFormatException(
        'Le numéro de téléphone fourni est trop long ou contient des caractères invalides.'
      );
    }
    if (email && (typeof email !== 'string' || email.length > 40 || !emailRegex.test(email))) {
      throw new Exceptions.InvalidEmailFormatException();
    }

    try {
      return await this.profilFacade.updateUserProfile(userId, data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil utilisateur:', error);
      throw new Exceptions.ProfileUpdateException(
        error,
        `Erreur lors de la mise à jour du profil utilisateur ${userId}`
      );
    }
  }
}
