import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { Url } from './url.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.URLS_API_DB_HOST,
      port: Number(process.env.URLS_API_DB_PORT),
      username: process.env.URLS_API_DB_USERNAME,
      password: process.env.URLS_API_DB_PASSWORD,
      database: process.env.URLS_API_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Url]),
    JwtModule.register({
      secret: process.env.URLS_API_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UrlController],
  providers: [UrlService, JwtStrategy],
})
export class AppModule {}
