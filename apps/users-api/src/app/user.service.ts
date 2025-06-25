import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  private users: UserDto[] = [];
  private idCounter = 1;

  create(user: UserDto): UserDto {
    const newUser = { ...user, id: this.idCounter++ };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): UserDto[] {
    return this.users;
  }

  findOne(id: number): UserDto {
    const user = this.users.find(u => u.id === id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  update(id: number, user: UserDto): UserDto {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    this.users[idx] = { ...this.users[idx], ...user, id };
    return this.users[idx];
  }

  remove(id: number): void {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    this.users.splice(idx, 1);
  }
}
