import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationController } from './organization.controller';
import { ORGANIZATION } from '@app/libs/common/models/db.model';
import { OrganizationSchema } from '@app/libs/common/schemas/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ORGANIZATION.name,
        useFactory: () => OrganizationSchema,
      },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
