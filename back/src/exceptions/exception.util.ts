import { HttpStatus } from '@nestjs/common'
import * as userExceptions from './user.exceptions'

export function handleException(error: unknown): { message: string; status: HttpStatus } {
  if (
    error instanceof userExceptions.UserNotFoundException ||
    error instanceof userExceptions.ProfileNotFoundException
  ) {
    return { message: error.message, status: HttpStatus.NOT_FOUND };
  }

  if (
    error instanceof userExceptions.UserCreationException ||
    error instanceof userExceptions.InvalidEmailFormatException ||
    error instanceof userExceptions.InvalidUserDataException
  ) {
    return { message: error.message, status: HttpStatus.BAD_REQUEST };
  }

  if (
    error instanceof userExceptions.ProfileCreationException ||
    error instanceof userExceptions.ProfileUpdateException ||
    error instanceof userExceptions.DatabaseException ||
    error instanceof userExceptions.UserDeleteException
  ) {
    return { message: error.message, status: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  if (error instanceof userExceptions.UserAlreadyExistsException) {
    return { message: error.message, status: HttpStatus.CONFLICT };
  }

  //console.error('Erreur inconnue :', error);
  return { message: 'Erreur interne du serveur', status: HttpStatus.INTERNAL_SERVER_ERROR };
}
