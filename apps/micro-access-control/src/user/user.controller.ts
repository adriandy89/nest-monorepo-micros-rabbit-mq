import { UserService } from './user.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserMsg } from '@app/libs/common/constants/rabbitmq.constants';
import { handleError } from '@app/libs/common/utils/error-handler-micro';
import { UserDTO } from '@app/libs/common/dtos/user.dto';
import { IMeta } from '@app/libs/common/interfaces/metadata.interface';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMsg.CREATE)
  create(@Payload() payload: { userDTO: UserDTO; meta: IMeta }) {
    return this.userService
      .create(payload.userDTO, payload.meta)
      .catch((error) => {
        handleError(
          error.code === 11000
            ? { code: 409, message: 'Duplicate, already exist' }
            : undefined,
        );
      });
  }

  @MessagePattern(UserMsg.FIND_ALL)
  findAll(@Payload() payload: { meta: IMeta }) {
    console.log(payload.meta);
    return this.userService.findAll(payload.meta);
  }

  @MessagePattern(UserMsg.FIND_ONE)
  async findOne(@Payload() payload: { id: string; meta: IMeta }) {
    const found = await this.userService.findOne(payload.id, payload.meta);
    if (!found) {
      handleError({ code: 404, message: 'Not Found' });
    }
    return found;
  }
  @MessagePattern(UserMsg.UPDATE)
  update(@Payload() payload: { id: string; userDTO: UserDTO; meta: IMeta }) {
    return this.userService.update(payload.id, payload.userDTO, payload.meta);
  }

  @MessagePattern(UserMsg.DELETE)
  delete(@Payload() payload: { id: string; meta: IMeta }) {
    return this.userService.delete(payload.id, payload.meta);
  }

  @MessagePattern(UserMsg.VALID_USER)
  async validateUser(@Payload() payload) {
    const user = await this.userService.findByUsername(payload.username);
    if (!user) return null;

    const isValidPassword = await this.userService.checkPassword(
      payload.password,
      user.password,
    );

    if (user && isValidPassword) return user;

    return null;
  }
}
