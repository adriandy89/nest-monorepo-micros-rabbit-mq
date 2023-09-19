import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { MicroAccessControlModule } from './micro-access-control.module';
import { RabbitMQ } from '@app/libs/common/constants/rabbitmq.constants';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.createMicroservice(MicroAccessControlModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: RabbitMQ.AccessControlQueue,
    },
  });
  await app.listen();
  console.log('Microservice MicroAccessControl is listening');
}
bootstrap();
