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
import { RoleMsg } from '@app/libs/common/constants/rabbitmq.constants';
import { RoleDTO } from '@app/libs/common/dtos/role.dto';
import { Permissions } from '../auth/decorators/permission.decorator';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { GetUserInfo } from '../auth/decorators/get-user-info.decorator';
import { IMeta } from '@app/libs/common/interfaces/metadata.interface';

@ApiTags('role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly clientProxy: ClientProxyAPI) {}
  private clientProxyAccessControl =
    this.clientProxy.clientProxyAccessControl();

  @Post()
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  create(@Body() roleDTO: RoleDTO, @GetUserInfo() meta: IMeta) {
    return this.clientProxyAccessControl.send(RoleMsg.CREATE, {
      roleDTO,
      meta,
    });
  }

  @Get()
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  findAll(@GetUserInfo() meta: IMeta) {
    return this.clientProxyAccessControl.send(RoleMsg.FIND_ALL, { meta });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  findOne(@Param('id') id: string, @GetUserInfo() meta: IMeta) {
    return this.clientProxyAccessControl.send(RoleMsg.FIND_ONE, { id, meta });
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({})
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  update(
    @Param('id') id: string,
    @Body() roleDTO: Partial<RoleDTO>,
    @GetUserInfo() meta: IMeta,
  ) {
    return this.clientProxyAccessControl.send(RoleMsg.UPDATE, {
      id,
      roleDTO,
      meta,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  delete(@Param('id') id, @GetUserInfo() meta: IMeta) {
    return this.clientProxyAccessControl.send(RoleMsg.DELETE, { id, meta });
  }
}
