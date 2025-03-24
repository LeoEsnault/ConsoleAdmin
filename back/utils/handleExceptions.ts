import { HttpStatus, HttpException } from '@nestjs/common';
import * as Exceptions from '../src/exceptions';

const groupedExceptions: Partial<Record<HttpStatus, Function[]>> = {
  [HttpStatus.NOT_FOUND]: [
    Exceptions.UserNotFoundException,
    Exceptions.ProfileNotFoundException,
    Exceptions.EnterpriseNotFoundException,
    Exceptions.RoleNotFoundException,
    Exceptions.EstablishmentNotFoundException,
  ],
  [HttpStatus.BAD_REQUEST]: [
    Exceptions.UserCreationException,
    Exceptions.InvalidEmailFormatException,
    Exceptions.InvalidUserDataException,
    Exceptions.SuperAdminDeleteException,
    Exceptions.InvalidFormatException,
    Exceptions.InvalidEstablishmentDataException,
    Exceptions.EstablishmentCreationException,
  ],
  [HttpStatus.INTERNAL_SERVER_ERROR]: [
    Exceptions.ProfileCreationException,
    Exceptions.ProfileUpdateException,
    Exceptions.DatabaseException,
    Exceptions.UserDeleteException,
    Exceptions.DatabaseQueryException,
  ],
  [HttpStatus.CONFLICT]: [Exceptions.UserAlreadyExistsException, Exceptions.EstablishmentAlreadyExistsException],
};

// Map : exception with HttpStatus
const exceptionStatusMap = new Map<Function, HttpStatus>();
for (const [status, exceptions] of Object.entries(groupedExceptions)) {
  exceptions.forEach((exception) => exceptionStatusMap.set(exception, Number(status) as HttpStatus));
}

// handle
export function handleException(error: any): { message: string; status: HttpStatus } {
  // gestion des exceptions
  if (error instanceof Error) {
    const status = exceptionStatusMap.get(error.constructor) || HttpStatus.INTERNAL_SERVER_ERROR;
    return { message: error.message, status };
  }

  // gestion erreur globale
  if (error?.response?.message && error?.response?.statusCode) {
    return { message: error.response.message, status: error.response.statusCode };
  }

  // gestion des erreurs inconnues
  //console.error('Erreur inconnue :', error);
  return { message: 'Erreur interne du serveur', status: HttpStatus.INTERNAL_SERVER_ERROR };
}
