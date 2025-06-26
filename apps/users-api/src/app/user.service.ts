import { Injectable, ConflictException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError, QueryFailedError } from 'typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(user: Partial<User>): Promise<User> {
    user.password = await this.authService.hashPassword(user.password!);
    const newUser = this.userRepository.create(user);
    try {
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        // 23505 = unique_violation (Postgres)
        throw new ConflictException('E-mail já cadastrado');
      }
      throw error;
    }
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Usuário não encontrado');
      }
      throw error;
    }
  }

  async update(id: number, user: Partial<User>): Promise<{ message: string; user?: User }> {
    const result = await this.userRepository.update(id, user);
    if (result.affected && result.affected > 0) {
      const updatedUser = await this.findOne(id);
      return { message: 'Usuário atualizado com sucesso', user: updatedUser };
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.userRepository.delete(id);
    if (result.affected && result.affected > 0) {
      return { message: 'Usuário deletado com sucesso' };
    } else {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
