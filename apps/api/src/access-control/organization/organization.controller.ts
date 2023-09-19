import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ClientProxyAPI } from '../common/proxy/client-proxy';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationMsg } from '@app/libs/common/constants/rabbitmq.constants';
import { OrganizationDTO } from '@app/libs/common/dtos/organization.dto';
import { SAdminGuard } from '../auth/guards/sadmin.guard';

@ApiTags('organization')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(private readonly clientProxy: ClientProxyAPI) {}
  private clientProxyAccessControl =
    this.clientProxy.clientProxyAccessControl();

  @Post()
  @UseGuards(SAdminGuard)
  create(@Body() organizationDTO: OrganizationDTO) {
    return this.clientProxyAccessControl.send(
      OrganizationMsg.CREATE,
      organizationDTO,
    );
  }

  @Get()
  @UseGuards(SAdminGuard)
  findAll() {
    return this.clientProxyAccessControl.send(OrganizationMsg.FIND_ALL, '');
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @UseGuards(SAdminGuard)
  findOne(@Param('id') id: string) {
    return this.clientProxyAccessControl.send(OrganizationMsg.FIND_ONE, id);
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({})
  @UseGuards(SAdminGuard)
  update(
    @Param('id') id: string,
    @Body() organizationDTO: Partial<OrganizationDTO>,
  ) {
    return this.clientProxyAccessControl.send(OrganizationMsg.UPDATE, {
      id,
      organizationDTO,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @UseGuards(SAdminGuard)
  delete(@Param('id') id) {
    return this.clientProxyAccessControl.send(OrganizationMsg.DELETE, id);
  }
}
