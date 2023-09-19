import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ProxyModule } from '../common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
