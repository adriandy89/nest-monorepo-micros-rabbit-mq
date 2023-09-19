import { Module } from '@nestjs/common';
import { ClientProxyAPI } from './client-proxy';

@Module({
  providers: [ClientProxyAPI],
  exports: [ClientProxyAPI],
})
export class ProxyModule {}
