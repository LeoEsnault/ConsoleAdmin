import { Injectable } from '@nestjs/common';
import { ProfilFacade } from './profil.facade';
import * as Exceptions from '../exceptions';
import { isValidEmail, isValidPhone, MAX_NAME_LENGTH } from '../../utils/isValidEmail';

@Injectable()
export class ProfilService {
  constructor(private readonly profilFacade: ProfilFacade) {}

  async getUserProfile(userId: string) {
    const { data: user, error: getUserError } = await this.profilFacade.getUser(userId);
    if (getUserError || !user) {
      throw new Exceptions.UserNotFoundException();
    }
  
    const {error: getProfileError, data: profile} = await this.profilFacade.getProfile(userId);
   
    if (getProfileError || !profile) {
      throw new Exceptions.ProfileNotFoundException();
    }
  
    return { user, profile };
  }



  async updateUserProfile(userId: string, data: any) {
    const { phone, email, firstname, lastname } = data;

    if (lastname && lastname.length > MAX_NAME_LENGTH || firstname && firstname.length > MAX_NAME_LENGTH) {
      throw new Exceptions.InvalidFormatException('Le nom ou le prénom fourni est trop long ou contient des caractères invalides.');
    }

    if (!isValidPhone(phone) || !isValidEmail(email) ) {
  
      throw new Exceptions.InvalidFormatException(
        'Le numéro de téléphone ou l\'adresse email fourni ne sont pas valides.'
      );
    }
      const {data: profilUpdateAuth, error: profilUpdateAuthError} = await this.profilFacade.updateAuth(userId, data);
      
      if ( profilUpdateAuthError) {
        throw new Exceptions.ProfileUpdateException();
      }

      const {data: profilUpdate, error: profilUpdateError} = await this.profilFacade.updateProfile(userId, data);

      if ( profilUpdateError) {
        throw new Exceptions.ProfileUpdateException();
      }

      return { profilUpdateAuth, profilUpdate}



    } 
    }
  

