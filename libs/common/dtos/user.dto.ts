import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly username: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  @ApiProperty({ type: Boolean })
  @IsOptional()
  readonly active?: boolean;
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  readonly organization: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  readonly role: string;
}
