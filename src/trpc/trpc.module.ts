import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { AppContext } from './context/app.context';
import { TrpcPanelController } from './trpc-panel.controller';
import { TrpcLoggerMiddleware } from './middleware/trpc-logger.middleware';

@Module({
  imports: [
    TRPCModule.forRoot({
      // autoSchemaFile: 'src/trpc/@generated',
      context: AppContext,
    }),
  ],
  controllers: [TrpcPanelController],
  providers: [TrpcLoggerMiddleware, AppContext],
})
export class TrpcModule {}
