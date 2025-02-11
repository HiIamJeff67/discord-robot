import { Inject, Injectable, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { DrizzleDB } from '../drizzle/types/drizzle';
import { AccessTokenCacheManager } from '../access-token-cache/access-token-cache.manager';
import {
  AuthInvalidAccessTokenException,
  AuthMissingTokenException,
  UserNotFoundInSocketException,
} from '../exceptions';
import {
  SocketMetaPayloadInterface,
  ValidateTokenDataInterface,
} from '../interfaces';
import { getNotificationSubscriptionChannelName } from '../utils';
import { HttpStatusCode } from '../enums';
import { SubscribeNotificationDto } from './dto/subscribe-notification.dto';
import { Notification } from './models/notification.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly accessTokenCacheManager: AccessTokenCacheManager,
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
  ) {}

  @WebSocketServer()
  private server: Server;

  private UserToSocketMap = new Map<string, SocketMetaPayloadInterface>();
  private SocketToUserMap = new Map<string, string>();

  /* ============================== Validate Operations ============================== */
  private async _getUserByAccessToken(
    accessToken: string,
  ): Promise<ValidateTokenDataInterface> {
    const responseOfAccessToken =
      await this.accessTokenCacheManager.get(accessToken);
    if (!responseOfAccessToken) {
      throw AuthInvalidAccessTokenException;
    }

    return responseOfAccessToken;
  }
  /* ============================== Validate Operations ============================== */

  /* ================================= Connect operations ================================= */
  async handleConnection(socket: Socket) {
    try {
      const accessToken = socket.handshake.headers.authorization?.split(' ')[1];
      if (!accessToken) throw AuthMissingTokenException;

      const user = await this._getUserByAccessToken(accessToken);
      if (!user) {
        throw AuthInvalidAccessTokenException;
      }

      if (this.UserToSocketMap.has(user.id)) {
        const existingUser = this.UserToSocketMap.get(user.id);
        if (existingUser) {
          this.UserToSocketMap.delete(user.id);
          existingUser.socket.disconnect(true);
        }
      }
      if (this.SocketToUserMap.has(socket.id)) {
        const existingSocket = this.SocketToUserMap.get(socket.id);
        if (existingSocket) {
          this.SocketToUserMap.delete(socket.id);
        }
      }
      this.UserToSocketMap.set(user.id, {
        userName: user.userName,
        status: user.status,
        role: user.role,
        plan: user.plan,
        socket: socket,
      });
      this.SocketToUserMap.set(socket.id, user.id);

      socket.join(getNotificationSubscriptionChannelName(socket.id));

      return {
        status: HttpStatusCode.SwitchingProtocols,
        upgrade: socket.handshake.headers.upgrade,
        message: `User ${user.userName} connected with socket ID: ${socket.id}`,
      };
    } catch (error) {
      console.log(`Connection failed: ${error}`);
      socket.disconnect(true);
      return {
        status: error.status,
        upgrade: error.headers.upgrade,
        message: error,
      };
    }
  }
  /* ================================= Connect operations ================================= */

  /* ================================= Disconnect operations ================================= */
  async handleDisconnect(socket: Socket) {
    try {
      const [userId, userData] = Array.from(
        this.UserToSocketMap.entries(),
      ).find(([, metaPayload]) => metaPayload.socket.id === socket.id) || [
        undefined,
        undefined,
      ];
      if (!userId || !userData) {
        throw UserNotFoundInSocketException;
      }

      socket.disconnect(true);
      this.UserToSocketMap.delete(userId);
      this.SocketToUserMap.delete(socket.id);

      return {
        status: HttpStatusCode.SwitchingProtocols,
        message: `Good bye! User ${userData.userName} disconnected with socket ID: ${socket.id}`,
      };
    } catch (error) {
      console.log(`Disconnection failed: ${error}`);
      return {
        status: error.status,
        message: error,
      };
    }
  }

  @SubscribeMessage('forceDisconnect')
  forceDisconnect(socket: Socket) {
    if (socket) {
      socket.disconnect(true);
    }
  }
  /* ================================= Disconnect operations ================================= */

  /* ================================= Subscribe operations ================================= */
  @SubscribeMessage('notifications')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  handleReceiveNotifications(
    @MessageBody() msg: SubscribeNotificationDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const receiverId = this.SocketToUserMap.get(msg.receiverSocketId);
    if (msg.receiverSocketId !== socket.id || !receiverId) return;

    const receiverData = this.UserToSocketMap.get(receiverId);
    if (!receiverData) return;
    console.log(`User ${receiverData.userName} just received a message`);
  }
  /* ================================= Subscribe operations ================================= */

  /* ================================= Publish operations ================================= */
  notifyUser(userId: string, notification: Notification): boolean {
    const receiverSocket = this.UserToSocketMap.get(userId);
    if (!receiverSocket) return false;

    const destRoomId = getNotificationSubscriptionChannelName(
      receiverSocket.socket.id,
    );
    const receiverId = this.SocketToUserMap.get(receiverSocket.socket.id);
    if (!receiverId) return false;

    this.server.to(destRoomId).emit('notifications', notification);

    return true;
  }
  /* ================================= Publish operations ================================= */
}
