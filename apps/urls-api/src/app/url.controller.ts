import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { Request } from 'express';

@Controller('urls')
export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() url: Partial<Url>, @Req() req: Request) {
        if (!url.originalUrl) {
            throw new BadRequestException('originalUrl é obrigatório');
        }
        // Pega o id do usuário autenticado
        const userId = (req as any).user?.userId;
        return this.urlService.create({
            originalUrl: url.originalUrl,
            userId: userId
        });
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req: Request) {
        const userId = (req as any).user?.userId;
        return this.urlService.findAllByUser(userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: Request) {
        const userId = (req as any).user?.userId;
        return this.urlService.findOneByUser(Number(id), userId);
    }

    @Get('short/:shortUrl')
    async findByShortUrl(@Param('shortUrl') shortUrl: string) {
        const url = await this.urlService.findOneByShortUrlAndIncrement(shortUrl);
        if (!url) throw new BadRequestException('URL não encontrada');
        return url;
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() url: Partial<Url>, @Req() req: Request) {
        const userId = (req as any).user?.userId;
        return this.urlService.updateByUser(Number(id), url, userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: Request) {
        const userId = (req as any).user?.userId;
        return this.urlService.removeByUser(Number(id), userId);
    }
}
