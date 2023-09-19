import { RoleService } from './role.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoleMsg } from '@app/libs/common/constants/rabbitmq.constants';
import { RoleDTO } from '@app/libs/common/dtos/role.dto';
import { handleError } from '@app/libs/common/utils/error-handler-micro';
import { IMeta } from '@app/libs/common/interfaces/metadata.interface';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @MessagePattern(RoleMsg.CREATE)
  create(@Payload() payload: { roleDTO: RoleDTO; meta: IMeta }) {
    return this.roleService
      .create(payload.roleDTO, payload.meta)
      .catch((error) => {
        handleError(
          error.code === 11000
            ? { code: 409, message: 'Duplicate, already exist' }
            : undefined,
        );
      });
  }

  @MessagePattern(RoleMsg.FIND_ALL)
  findAll(@Payload() payload: { meta: IMeta }) {
    return this.roleService.findAll(payload.meta);
  }

  @MessagePattern(RoleMsg.FIND_ONE)
  async findOne(@Payload() payload: { id: string; meta: IMeta }) {
    const found = await this.roleService.findOne(payload.id, payload.meta);
    if (!found) {
      handleError({ code: 404, message: 'Not Found' });
    }
    return found;
  }

  @MessagePattern(RoleMsg.UPDATE)
  update(@Payload() payload: { id: string; roleDTO: RoleDTO; meta: IMeta }) {
    return this.roleService.update(payload.id, payload.roleDTO, payload.meta);
  }

  @MessagePattern(RoleMsg.DELETE)
  delete(@Payload() payload: { id: string; meta: IMeta }) {
    return this.roleService.delete(payload.id, payload.meta);
  }
}
