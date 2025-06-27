import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const mockUser = { id: 1, name: 'Test', email: 'test@test.com', password: '123' };

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Novo Nome' }),
            remove: jest.fn().mockResolvedValue({ ...mockUser, deleted_at: new Date() }),
          },
        },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('deve criar um usuário', async () => {
    const result = await controller.create({ name: 'Test', email: 'test@test.com', password: '123' });
    expect(result).toEqual(mockUser);
  });

  it('deve listar todos os usuários', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
  });

  it('deve buscar um usuário por id', async () => {
    const result = await controller.findOne('1');
    expect(result).toEqual(mockUser);
  });

  it('deve atualizar um usuário', async () => {
    const result = await controller.update('1', { name: 'Novo Nome' });
    expect(result).toEqual({ ...mockUser, name: 'Novo Nome' });
  });

  it('deve deletar (soft delete) um usuário', async () => {
    const result = await service.remove(1);
    expect(result).toHaveProperty('deleted_at');
  });
});
