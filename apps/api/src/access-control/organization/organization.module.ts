import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { ProxyModule } from '../common/proxy/proxy.module';

@Module({
  imports: [ProxyModule],
  controllers: [OrganizationController],
  providers: [],
})
export class OrganizationModule {}
