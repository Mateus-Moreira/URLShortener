import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';

describe('UserService', () => {
  let service: UserService;
  let mockRepo: any;
  let mockAuth: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn().mockImplementation((u) => u),
      save: jest.fn().mockImplementation((u) => Promise.resolve({ ...u, id: 1 })),
    };
    mockAuth = {
      hashPassword: jest.fn().mockResolvedValue('hashedpass'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: AuthService, useValue: mockAuth },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('deve criar um usuário com senha criptografada', async () => {
    const user = { name: 'Test', email: 'test@test.com', password: '123' };
    const result = await service.create(user);
    expect(mockAuth.hashPassword).toHaveBeenCalledWith('123');
    expect(mockRepo.save).toHaveBeenCalledWith({ ...user, password: 'hashedpass' });
    expect(result).toHaveProperty('id');
    expect(result.password).toBe('hashedpass');
  });
});
