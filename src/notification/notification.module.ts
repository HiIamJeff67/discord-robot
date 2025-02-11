import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { NotificationGateway } from './notification.gateway';
import { AccessTokenCacheModule } from '../access-token-cache/access-token-cache.module';

@Module({
  imports: [DrizzleModule, AccessTokenCacheModule],
  providers: [NotificationGateway, NotificationResolver, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
