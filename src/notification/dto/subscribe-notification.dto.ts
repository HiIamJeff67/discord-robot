import { IsNotEmpty, IsString } from 'class-validator';
import { Notification } from '../models/notification.model';

export class SubscribeNotificationDto extends Notification {
  @IsNotEmpty()
  @IsString()
  receiverSocketId: string;
}
