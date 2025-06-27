import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.USERS_API_DB_HOST,
      port: Number(process.env.USERS_API_DB_PORT),
      username: process.env.USERS_API_DB_USERNAME,
      password: process.env.USERS_API_DB_PASSWORD,
      database: process.env.USERS_API_DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.USERS_API_JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService, JwtStrategy, JwtAuthGuard],
})
export class AppModule {}
