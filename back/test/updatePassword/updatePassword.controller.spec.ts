import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePasswordController } from '../../src/updatePassword/updatePassword.controller';
import { UpdatePasswordService } from '../../src/updatePassword/updatePassword.service';
import * as Exceptions from '../../src/exceptions';


describe('UpdatePasswordController', () => {
  let controller: UpdatePasswordController;
  let service: UpdatePasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdatePasswordController],
      providers: [
        {
          provide: UpdatePasswordService,
          useValue: {
            updatePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UpdatePasswordController>(UpdatePasswordController);
    service = module.get<UpdatePasswordService>(UpdatePasswordService);
  });

  it('should update password successfully', async () => {
    const access_token = 'valid_access_token';
    const newPassword = 'new_password';

    jest.spyOn(service, 'updatePassword').mockResolvedValue(null);

    await expect(controller.updatePassword(access_token, newPassword)).resolves.toBeUndefined();
    expect(service.updatePassword).toHaveBeenCalledWith(access_token, newPassword);
  });

  it('should throw ProfileUpdateException if updatePassword fails', async () => {
    const access_token = 'invalid_access_token';
    const newPassword = 'new_password';

    jest.spyOn(service, 'updatePassword').mockResolvedValue('some_error');

    await expect(controller.updatePassword(access_token, newPassword)).rejects.toThrow(Exceptions.ProfileUpdateException);
    expect(service.updatePassword).toHaveBeenCalledWith(access_token, newPassword);
  });
});
