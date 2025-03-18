import { Injectable } from '@nestjs/common';
import { ProfilFacade } from './profil.facade';
import * as Exceptions from '../exceptions';
import { isValidEmail, isValidPhone } from '../../utils/isValidEmail';

@Injectable()
export class ProfilService {
  constructor(private readonly profilFacade: ProfilFacade) {}

  async getUserProfile(userId: string) {
    const { user, error: getUserError } = await this.profilFacade.getUser(userId);
    if (getUserError || !user) {
      throw new Exceptions.UserNotFoundException();
    }
  
    const profileResponse = await this.profilFacade.getProfile(userId);
    const { profile, error: getProfileError } = profileResponse || {}; 
    if (getProfileError || !profile) {
      throw new Exceptions.ProfileNotFoundException();
    }
  
    return { user, profile };
  }



  async updateUserProfile(userId: string, data: any) {
    const { phone, email, firstname, lastname } = data;

    if (lastname && lastname.length > 40) {
      throw new Exceptions.InvalidFormatException('Le nom fourni est trop long ou contient des caractères invalides.');
    }
    if (firstname && firstname.length > 40) {
      throw new Exceptions.InvalidFormatException(
        'Le prénom fourni est trop long ou contient des caractères invalides.'
      );
    }
    if (!isValidPhone(phone)) {
      throw new Exceptions.InvalidFormatException(
        'Le numéro de téléphone fourni est trop long ou contient des caractères invalides.'
      );
    }
    if (!isValidEmail(email)) {
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
