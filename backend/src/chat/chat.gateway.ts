import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (userId) {
            client.join(`user_${userId}`);
            console.log(`User ${userId} joined room: user_${userId}`);
        }
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() data: any): void {
        this.server.emit('receiveMessage', data);
    }

    @SubscribeMessage('sendPrivateMessage')
    handlePrivateMessage(@MessageBody() data: { senderId: string; receiverId: string; content: string; senderName: string }): void {
        const { receiverId } = data;
        this.server.to(`user_${receiverId}`).emit('receivePrivateMessage', data);
        this.server.to(`user_${data.senderId}`).emit('receivePrivateMessage', data);
    }

    @SubscribeMessage('sendAnnouncement')
    handleAnnouncement(@MessageBody() data: any): void {
        this.server.emit('receiveAnnouncement', data);
    }
}
