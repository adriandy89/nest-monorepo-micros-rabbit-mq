import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleController } from './role.controller';
import { ROLE } from '@app/libs/common/models/db.model';
import { RoleSchema } from '@app/libs/common/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ROLE.name,
        useFactory: () => RoleSchema,
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
