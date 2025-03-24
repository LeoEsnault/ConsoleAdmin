import { Injectable, BadRequestException } from '@nestjs/common';
import * as establishmentFacade from './establishment.facade';
import * as Exceptions from '../exceptions';

export interface Establishment {
  id: string;
  name?: string;
  enterprise_id?: string;
}

export interface CreateEstablishmentBody {
  name: string;
  enterprise_id: string;
}

@Injectable()
export class EstablishmentService {
  async createEstablishment(body: CreateEstablishmentBody): Promise<Establishment> {
    if (!body.name || !body.enterprise_id) {
      throw new Exceptions.InvalidEstablishmentDataException();
    }

    const { error: enterpriseError } = await establishmentFacade.getEnterprise(body.enterprise_id);

    if (enterpriseError) {
      throw new Exceptions.EnterpriseNotFoundException(enterpriseError);
    }

    const { data: existingEstablishment, error: existingError } = await establishmentFacade.getEstablishment(
      body.name,
      body.enterprise_id
    );

    if (existingError) {
      throw new Exceptions.DatabaseQueryException(existingError);
    }

    if (existingEstablishment) {
      throw new Exceptions.EstablishmentAlreadyExistsException();
    }

    const { data: establishment, error: establishmentError } = await establishmentFacade.createEstablishment(
      body.name,
      body.enterprise_id
    );

    if (establishmentError) {
      throw new Exceptions.EstablishmentCreationException();
    }

    if (!establishment) {
      throw new Exceptions.EstablishmentNotFoundException();
    }

    return establishment;
  }

  async updateEstablishment(id: string, body: Establishment) {
    if (!id || !body.name || !body.enterprise_id) {
      throw new BadRequestException('Missing data');
    }

    const { error: establishmentError } = await establishmentFacade.getEstablishmentById(id);

    if (establishmentError) {
      throw new Exceptions.EstablishmentNotFoundException();
    }

    // check doublons
    if (body.name) {
      const { data: existingEsta, error: existingEstaError } = await establishmentFacade.getEstablishment(
        body.name,
        body.enterprise_id
      );

      if (existingEstaError) {
        throw new Exceptions.DatabaseQueryException(existingEstaError);
      }

      if (existingEsta) {
        throw new Exceptions.EstablishmentAlreadyExistsException();
      }
    }

    // update
    const { data: establishmentUpdate, error: establishmentUpdateError } =
      await establishmentFacade.updateEstablishment(id, body);

    if (establishmentUpdateError) {
      throw new Exceptions.EstablishmentUpdateException();
    }

    return establishmentUpdate;
  }

  async deleteEstablishment(id: string) {
    if (!id) {
      throw new BadRequestException('Missing data');
    }

    const { error } = await establishmentFacade.deleteEstablishment(id);

    if (error) {
      throw new Exceptions.EstablishmentDeleteException();
    }

    return 'ok';
  }
}
