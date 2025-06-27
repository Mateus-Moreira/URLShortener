import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError, IsNull } from 'typeorm';
import { Url } from './url.entity';

function generateShortUrl(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async create(url: { originalUrl: string; userId?: number }): Promise<Url> {
    let shortUrl = '';
    let exists = true;
    // Garante unicidade da shortUrl
    while (exists) {
      shortUrl = generateShortUrl();
      exists = !!(await this.urlRepository.findOneBy({ shortUrl }));
    }
    const newUrl = this.urlRepository.create({
      originalUrl: url.originalUrl,
      userId: url.userId,
      shortUrl,
    });
    try {
      return await this.urlRepository.save(newUrl);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException('URL encurtada já existe');
      }
      throw error;
    }
  }

  findAll(): Promise<Url[]> {
    return this.urlRepository.find();
  }

  async findAllByUser(userId: number): Promise<Url[]> {
    return this.urlRepository.find({ where: { userId, deleted_at: IsNull() } });
  }

  async findOne(id: number): Promise<Url> {
    const url = await this.urlRepository.findOneBy({ id });
    if (!url) throw new NotFoundException('URL não encontrada');
    return url;
  }

  async findOneByUser(id: number, userId: number): Promise<Url> {
    const url = await this.urlRepository.findOne({ where: { id, userId, deleted_at: IsNull() } });
    if (!url) throw new NotFoundException('URL não encontrada ou não pertence ao usuário');
    return url;
  }

  async findOneByShortUrlAndIncrement(shortUrl: string): Promise<Url> {
    const url = await this.urlRepository.findOneBy({ shortUrl });
    if (!url) throw new NotFoundException('URL não encontrada');
    url.accessCount = (url.accessCount ?? 0) + 1;
    await this.urlRepository.save(url);
    return url;
  }

  async update(id: number, url: Partial<Url>): Promise<{ message: string; url?: Url }> {
    const result = await this.urlRepository.update(id, url);
    if (result.affected && result.affected > 0) {
      const updatedUrl = await this.findOne(id);
      return { message: 'URL atualizada com sucesso', url: updatedUrl };
    } else {
      throw new NotFoundException('URL não encontrada');
    }
  }

  async updateByUser(id: number, url: Partial<Url>, userId: number): Promise<{ message: string; url?: Url }> {
    const existing = await this.urlRepository.findOne({ where: { id, userId, deleted_at: IsNull() } });
    if (!existing) throw new NotFoundException('URL não encontrada ou não pertence ao usuário');
    await this.urlRepository.update(id, url);
    const updatedUrl = await this.findOne(id);
    return { message: 'URL atualizada com sucesso', url: updatedUrl };
  }

  async removeByUser(id: number, userId: number): Promise<{ message: string }> {
    const existing = await this.urlRepository.findOne({ where: { id, userId, deleted_at: IsNull() } });
    if (!existing) throw new NotFoundException('URL não encontrada ou não pertence ao usuário');
    await this.urlRepository.softDelete(id);
    return { message: 'URL deletada com sucesso' };
  }
}
