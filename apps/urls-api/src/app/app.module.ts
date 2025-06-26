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
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'urlsDB',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Url]),
    JwtModule.register({
      secret: 'sua_chave_secreta',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UrlController],
  providers: [UrlService, JwtStrategy],
})
export class AppModule {}
