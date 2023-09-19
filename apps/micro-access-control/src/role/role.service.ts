import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ROLE } from '@app/libs/common/models/db.model';
import { IRole } from '@app/libs/common/interfaces/role.interface';
import { RoleDTO } from '@app/libs/common/dtos/role.dto';
import { IMeta } from '@app/libs/common/interfaces/metadata.interface';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(ROLE.name)
    private readonly model: Model<IRole>,
  ) {}

  async create(roleDTO: RoleDTO, meta: IMeta): Promise<IRole> {
    const newRole = new this.model({
      ...roleDTO,
      organization: meta.organization ?? roleDTO.organization,
    });
    return await newRole.save();
  }

  async findAll(meta: IMeta): Promise<IRole[]> {
    let query = this.model.find().select('-createdA -__v');
    if (meta.organization) {
      query = query.find({ organization: meta.organization });
    }
    return await query.exec();
  }

  async findOne(id: string, meta: IMeta): Promise<IRole> {
    if (meta.organization) {
      return await this.model
        .findOne({ id, organization: meta.organization })
        .select('-createdAt -__v')
        .exec();
    }
    return await this.model.findById(id).select('-createdAt -__v').exec();
  }

  async update(id: string, roleDTO: RoleDTO, meta: IMeta): Promise<IRole> {
    if (meta.organization) {
      return await this.model
        .findOneAndUpdate(
          { _id: id, organization: meta.organization },
          roleDTO,
          { new: true },
        )
        .exec();
    }
    return await this.model.findByIdAndUpdate(id, roleDTO, { new: true });
  }

  async delete(id: string, meta: IMeta) {
    if (meta.organization) {
      await this.model
        .findOneAndDelete({
          _id: id,
          organization: meta.organization,
        })
        .exec();
    } else {
      await this.model.findByIdAndDelete(id);
    }
    return {
      status: HttpStatus.OK,
      msg: 'Deleted',
    };
  }
}
