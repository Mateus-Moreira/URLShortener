import { Body, Controller, Delete, Get, Param, Post, Put, BadRequestException, Req, UseGuards } from '@nestjs/common';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';
import type { Request } from 'express';

@Controller('urls')
export class UrlController {
    constructor(private readonly urlService: UrlService) { }

    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    create(@Body() url: Partial<Url>, @Req() req: Request) {
        if (!url.originalUrl) {
            throw new BadRequestException('originalUrl é obrigatório');
        }
        // Tenta pegar o id do usuário autenticado, se houver
        const userId = (req as any).user?.userId;
        return this.urlService.create({
            originalUrl: url.originalUrl,
            userId: userId ?? undefined
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

    @Get('short/:shortUrl')
    async findByShortUrl(@Param('shortUrl') shortUrl: string) {
        const url = await this.urlService.findOneByShortUrl(shortUrl);
        if (!url) throw new BadRequestException('URL não encontrada');
        return url;
    }

    @Put(':id')
    @UseGuards(OptionalJwtAuthGuard)
    async update(@Param('id') id: string, @Body() url: Partial<Url>, @Req() req: Request) {
        const userId = (req as any).user?.userId;
        const urlData = await this.urlService.findOne(Number(id));
        if (!userId || urlData.userId !== userId) {
            throw new BadRequestException('Você não tem permissão para atualizar esta URL');
        }
        return this.urlService.update(Number(id), url);
    }

    @Delete(':id')
    @UseGuards(OptionalJwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: Request) {
        const userId = (req as any).user?.userId;
        const urlData = await this.urlService.findOne(Number(id));
        if (!userId || urlData.userId !== userId) {
            throw new BadRequestException('Você não tem permissão para deletar esta URL');
        }
        return this.urlService.remove(Number(id));
    }
}
