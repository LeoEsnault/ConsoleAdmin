import { Injectable, BadRequestException } from '@nestjs/common';
import * as serviceFacade from './service.facade';
import * as Exceptions from '../exceptions';

export interface Service {
  id: string;
  name?: string;
  enterprise_id?: string;
}

export interface CreateServiceBody {
  name: string;
  enterprise_id: string;
}

@Injectable()
export class ServiceService {
  async createService(body: CreateServiceBody): Promise<Service> {
    if (!body.name || !body.enterprise_id) {
      throw new Exceptions.InvalidServiceDataException();
    }

    const { error: enterpriseError } = await serviceFacade.getEnterprise(body.enterprise_id);

    if (enterpriseError) {
      throw new Exceptions.EnterpriseNotFoundException(enterpriseError);
    }

    const { data: existingService, error: existingError } = await serviceFacade.getService(
      body.name,
      body.enterprise_id
    );

    if (existingError) {
      throw new Exceptions.DatabaseQueryServiceException(existingError);
    }

    if (existingService) {
      throw new Exceptions.ServiceAlreadyExistsException();
    }

    const { data: service, error: serviceError } = await serviceFacade.createService(body.name, body.enterprise_id);

    if (serviceError) {
      throw new Exceptions.ServiceCreationException();
    }

    if (!service) {
      throw new Exceptions.ServiceNotFoundException();
    }

    return service;
  }

  async updateService(id: string, body: Service) {
    if (!id || !body.name || !body.enterprise_id) {
      throw new BadRequestException('Missing data');
    }

    const { error: serviceError } = await serviceFacade.getServiceById(id);

    if (serviceError) {
      throw new Exceptions.ServiceNotFoundException();
    }

    // check doublons
    if (body.name) {
      const { data: existingService, error: existingServiceError } = await serviceFacade.getService(
        body.name,
        body.enterprise_id
      );

      if (existingServiceError) {
        throw new Exceptions.DatabaseQueryServiceException(existingServiceError);
      }

      if (existingService) {
        throw new Exceptions.ServiceAlreadyExistsException();
      }
    }

    // update
    const { data: serviceUpdate, error: serviceUpdateError } = await serviceFacade.updateService(id, body);

    if (serviceUpdateError) {
      throw new Exceptions.ServiceUpdateException();
    }

    return serviceUpdate;
  }

  async deleteService(id: string) {
    if (!id) {
      throw new BadRequestException('Missing data');
    }

    const { error } = await serviceFacade.deleteService(id);

    if (error) {
      throw new Exceptions.ServiceDeleteException();
    }

    return 'ok';
  }
}
