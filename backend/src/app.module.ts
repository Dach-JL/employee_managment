import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
import { Report } from './reports/entities/report.entity';
import { AnonymousReport } from './reports/entities/anonymous-report.entity';
import { PrivateMessage } from './chat/entities/private-message.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { ReportsModule } from './reports/reports.module';
import { ChatModule } from './chat/chat.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = configService.get<string>('DB_TYPE') || 'sqlite';
        if (type === 'sqlite') {
          return {
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [User, Task, Report, AnonymousReport, PrivateMessage],
            synchronize: true,
          };
        }
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Task, Report, AnonymousReport, PrivateMessage],
          synchronize: true,
        };
      },
    }),
    UsersModule,
    AuthModule,
    TasksModule,
    ReportsModule,
    ChatModule,
    AnalyticsModule,
    FilesModule,
  ],
  providers: [AppService],
})
export class AppModule { }
