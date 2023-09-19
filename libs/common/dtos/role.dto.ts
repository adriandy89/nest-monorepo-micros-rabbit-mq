import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class RoleDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  readonly organization: string;
  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  readonly permissions: {
    administration: string[];
    products: string[];
  };
}
