import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { ProxyModule } from '../common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [RoleController],
  providers: [],
})
export class RoleModule {}
