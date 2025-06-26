import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';

@Controller('urls')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  create(@Body() url: Partial<Url>) {
    if (!url.originalUrl) {
      throw new BadRequestException('originalUrl é obrigatório');
    }
    return this.urlService.create({
      originalUrl: url.originalUrl,
      ...(url.userId ? { userId: url.userId } : {})
    });
  }

  @Get()
  findAll() {
    return this.urlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() url: Partial<Url>) {
    return this.urlService.update(Number(id), url);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlService.remove(Number(id));
  }
}
