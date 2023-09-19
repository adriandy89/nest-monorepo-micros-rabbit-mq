import { Logger, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { WsJwtGuard } from 'apps/api/src/access-control/auth/guards/ws.guard';

@WebSocketGateway({
  namespace: 'ws-messages',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class WsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  private readonly logger = new Logger(WsGateway.name);

  @WebSocketServer()
  server: Server;

  private cartItems: any[] = [];

  afterInit(server: any) {
    this.logger.debug('WS Init');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.debug('Client connected: ' + client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug('Client disconnected: ' + client.id);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addItem')
  addItem(@MessageBody() item: any): void {
    console.log('addItem:', item);
    // Logic to add an item to the cart
    this.cartItems.push(item);
    this.server.emit('cartItems', { cartItems: this.cartItems }); // Send the updated cart items to all connected clients
  }

  @SubscribeMessage('removeItem')
  removeItem(@MessageBody() item: string): void {
    console.log('removeItem: ', item);
    // Logic to remove an item from the cart
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.server.emit('cartItems', { cartItems: this.cartItems }); // Send the updated cart items to all connected clients
    } else {
      this.server.emit('cartItems', { msg: 'ok' });
    }
  }
}
