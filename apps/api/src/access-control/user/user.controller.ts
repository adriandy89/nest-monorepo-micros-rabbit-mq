import {
  Body,
  ConflictException,
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
import { UserMsg } from '@app/libs/common/constants/rabbitmq.constants';
import { UserDTO } from '@app/libs/common/dtos/user.dto';
import { Permissions } from '../auth/decorators/permission.decorator';
import { PermissionsGuard } from '../auth/guards/permission.guard';
import { GetUserInfo } from '../auth/decorators/get-user-info.decorator';
import { IMeta } from '@app/libs/common/interfaces/metadata.interface';

@ApiTags('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly clientProxy: ClientProxyAPI) {}
  private clientProxyAccessControl =
    this.clientProxy.clientProxyAccessControl();

  @Post()
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  create(@Body() userDTO: UserDTO, @GetUserInfo() meta: IMeta) {
    if (userDTO.username == 'sadmin')
      throw new ConflictException('Duplicate, already exist');
    return this.clientProxyAccessControl.send(UserMsg.CREATE, {
      userDTO,
      meta,
    });
  }

  @Get()
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  findAll(@GetUserInfo() meta: IMeta) {
    console.log(meta);
    return this.clientProxyAccessControl.send(UserMsg.FIND_ALL, { meta });
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  findOne(@Param('id') id: string, @GetUserInfo() meta: IMeta) {
    return this.clientProxyAccessControl.send(UserMsg.FIND_ONE, { id, meta });
  }

  @Put(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiBody({})
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  update(
    @Param('id') id: string,
    @Body() userDTO: Partial<UserDTO>,
    @GetUserInfo() meta: IMeta,
  ) {
    if (userDTO.username == 'sadmin')
      throw new ConflictException('Duplicate, already exist');
    return this.clientProxyAccessControl.send(UserMsg.UPDATE, {
      id,
      userDTO,
      meta,
    });
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, required: true })
  @Permissions({ administration: ['list', 'create', 'update', 'delete'] })
  @UseGuards(PermissionsGuard)
  delete(@Param('id') id: string, @GetUserInfo() meta: IMeta) {
    return this.clientProxyAccessControl.send(UserMsg.DELETE, { id, meta });
  }
}
