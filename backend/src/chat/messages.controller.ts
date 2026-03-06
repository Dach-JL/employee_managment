import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) { }

    @Post('send')
    @ApiOperation({ summary: 'Send a private message' })
    async sendMessage(@Request() req, @Body() body: { receiverId: string; content: string }) {
        return this.messagesService.sendMessage(req.user, body.receiverId, body.content);
    }

    @Get('conversation/:userId')
    @ApiOperation({ summary: 'Get conversation with a specific user' })
    async getConversation(@Request() req, @Param('userId') userId: string) {
        const conversation = await this.messagesService.getConversation(req.user.id, userId);
        await this.messagesService.markAsRead(req.user.id, userId);
        return conversation;
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get total unread messages count' })
    async getUnreadCount(@Request() req) {
        return { count: await this.messagesService.getUnreadCount(req.user.id) };
    }
}
