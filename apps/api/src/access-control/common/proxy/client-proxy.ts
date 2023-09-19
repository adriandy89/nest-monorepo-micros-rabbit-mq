import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { RabbitMQ } from '@app/libs/common/constants/rabbitmq.constants';

@Injectable()
export class ClientProxyAPI {
  constructor(private readonly config: ConfigService) {}

  clientProxyAccessControl(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.config.get('AMQP_URL')],
        queue: RabbitMQ.AccessControlQueue,
      },
    });
  }
}
