import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrganizationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
