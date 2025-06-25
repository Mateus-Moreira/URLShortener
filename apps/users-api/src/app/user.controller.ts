import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: UserDto) {
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.update(Number(id), user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.userService.remove(Number(id));
    return { message: 'User deleted' };
  }
}
