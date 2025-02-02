import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { SecureGeneratorService } from './secret-generator.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  providers: [SecureGeneratorService],
  exports: [SecureGeneratorService],
})
export class SecureGeneratorModule {}
