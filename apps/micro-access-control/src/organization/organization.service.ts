import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ORGANIZATION } from '@app/libs/common/models/db.model';
import { IOrganization } from '@app/libs/common/interfaces/organization.interface';
import { OrganizationDTO } from '@app/libs/common/dtos/organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(ORGANIZATION.name)
    private readonly model: Model<IOrganization>,
  ) {}

  async findByOrganizationname(organizationname: string) {
    return await this.model.findOne({ organizationname });
  }

  async create(organizationDTO: OrganizationDTO): Promise<IOrganization> {
    const newOrganization = new this.model({ ...organizationDTO });
    return await newOrganization.save();
  }

  async findAll(): Promise<IOrganization[]> {
    return await this.model.find().select('-password -createdA -__v').exec();
  }

  async findOne(id: string): Promise<IOrganization> {
    return await this.model.findById(id);
  }

  async update(
    id: string,
    organizationDTO: OrganizationDTO,
  ): Promise<IOrganization> {
    return await this.model.findByIdAndUpdate(id, organizationDTO);
  }

  async delete(id: string) {
    await this.model.findByIdAndDelete(id);
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}
