import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './access-control/user/user.module';
import { AuthModule } from './access-control/auth/auth.module';
import { OrganizationModule } from './access-control/organization/organization.module';
import { RoleModule } from './access-control/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrganizationModule,
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
