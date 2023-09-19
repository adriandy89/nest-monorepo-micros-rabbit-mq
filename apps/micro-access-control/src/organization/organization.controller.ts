import { handleError } from '@app/libs/common/utils/error-handler-micro';
import { OrganizationService } from './organization.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrganizationMsg } from '@app/libs/common/constants/rabbitmq.constants';
import { OrganizationDTO } from '@app/libs/common/dtos/organization.dto';

@Controller()
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @MessagePattern(OrganizationMsg.CREATE)
  create(@Payload() organizationDTO: OrganizationDTO) {
    return this.organizationService.create(organizationDTO).catch((error) => {
      handleError(
        error.code === 11000
          ? { code: 409, message: 'Duplicate, already exist' }
          : undefined,
      );
    });
  }

  @MessagePattern(OrganizationMsg.FIND_ALL)
  findAll() {
    console.log('from organization');
    return this.organizationService.findAll();
  }

  @MessagePattern(OrganizationMsg.FIND_ONE)
  async findOne(@Payload() id: string) {
    const found = await this.organizationService.findOne(id);
    if (!found) {
      handleError({ code: 404, message: 'Not Found' });
    }
    return found;
  }

  @MessagePattern(OrganizationMsg.UPDATE)
  update(@Payload() payload: any) {
    return this.organizationService.update(payload.id, payload.organizationDTO);
  }

  @MessagePattern(OrganizationMsg.DELETE)
  delete(@Payload() id: string) {
    return this.organizationService.delete(id);
  }
}
