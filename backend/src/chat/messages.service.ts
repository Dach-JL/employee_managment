import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateMessage } from './entities/private-message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(PrivateMessage)
        private readonly messageRepository: Repository<PrivateMessage>,
    ) { }

    async sendMessage(sender: User, receiverId: string, content: string): Promise<PrivateMessage> {
        const message = this.messageRepository.create({
            sender,
            receiver: { id: receiverId } as any,
            content,
        });
        return this.messageRepository.save(message);
    }

    async getConversation(user1Id: string, user2Id: string): Promise<PrivateMessage[]> {
        return this.messageRepository.find({
            where: [
                { sender: { id: user1Id }, receiver: { id: user2Id } },
                { sender: { id: user2Id }, receiver: { id: user1Id } },
            ],
            order: { createdAt: 'ASC' },
            relations: ['sender', 'receiver'],
        });
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.messageRepository.count({
            where: { receiver: { id: userId }, isRead: false },
        });
    }

    async markAsRead(receiverId: string, senderId: string): Promise<void> {
        await this.messageRepository.update(
            { receiver: { id: receiverId }, sender: { id: senderId }, isRead: false },
            { isRead: true },
        );
    }
}
