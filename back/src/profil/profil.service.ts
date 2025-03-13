import { Injectable } from '@nestjs/common'
import { ProfilFacade } from './profil.facade'
import { ProfileNotFoundException, ProfileUpdateException } from '../exceptions/user.exceptions'

@Injectable()
export class ProfilService {
  constructor(private readonly profilFacade: ProfilFacade) {
  }


  async getUserProfile(userId: string) {
    try {
      return await this.profilFacade.getUserProfile(userId)
    } catch (error) {
      console.error('Erreur dans lors de la récupération du profil utilisateur:', error)
      throw new ProfileNotFoundException(error, `Erreur dans lors de la récupération du profil utilisateur ${userId}`)
    }
  }


  async updateUserProfile(userId: string, data: any) {
    const phone = data.phone;
    const email = data.email;

    if (!email || typeof email !== "string") {
      throw new Error("Email invalide !");
  }
  
  if (phone && typeof phone !== "string") {
      throw new Error("Numéro de téléphone invalide !");
  }
    try {
      return await this.profilFacade.updateUserProfile(userId, data)
    } catch (error) {
      console.error('Erreur dans lors de la mise à jour du profil utilisateur:', error)
      throw new ProfileUpdateException(error, `Erreur dans lors de la mise à jour du profil utilisateur ${userId}`)
    }
  }
}
