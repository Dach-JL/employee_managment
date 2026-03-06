import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from './chat.gateway';
import { PrivateMessage } from './entities/private-message.entity';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
    imports: [TypeOrmModule.forFeature([PrivateMessage])],
    controllers: [MessagesController],
    providers: [ChatGateway, MessagesService],
    exports: [ChatGateway, MessagesService],
})
export class ChatModule { }
