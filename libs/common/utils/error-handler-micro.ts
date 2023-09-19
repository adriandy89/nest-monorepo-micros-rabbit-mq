import { RpcException } from '@nestjs/microservices';

export const handleError = (error?: { code: number; message: string }) => {
  if (error) {
    throw new RpcException(error);
  }
  throw new RpcException({ code: 500, message: 'MicroService Error' });
};
