import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configs from './config';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      // @ts-ignore
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<number>('db.host'),
        port: configService.get<string>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        // entities: [User],
        autoLoadEntities: true,
        // synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configs],
    }),
  ],
})
export class AppModule {}
