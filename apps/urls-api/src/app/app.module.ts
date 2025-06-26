import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from './url.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'urlsDB',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Url]),
  ],
  controllers: [UrlController],
  providers: [UrlService],
})
export class AppModule {}
