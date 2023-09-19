import { HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from '@app/libs/common/models/db.model';
import { IUser } from '@app/libs/common/interfaces/user.interface';
import { UserDTO } from '@app/libs/common/dtos/user.dto';
import { IMeta } from '@app/libs/common/interfaces/metadata.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordDB);
  }

  async findByUsername(username: string) {
    return await this.model
      .findOne({ username })
      .populate({
        path: 'role',
        select: 'permissions _id',
      })
      .exec();
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async create(userDTO: UserDTO, meta: IMeta): Promise<IUser> {
    const hash = await this.hashPassword(userDTO.password);
    const newUser = new this.model({
      ...userDTO,
      organization: meta.organization ?? userDTO.organization,
      password: hash,
    });
    return await newUser.save();
  }

  async findAll(meta: IMeta): Promise<IUser[]> {
    let query = this.model.find().select('-password -createdAt -__v');
    if (meta.organization) {
      query = query.find({ organization: meta.organization });
    }
    return await query.exec();
  }

  async findOne(id: string, meta: IMeta): Promise<IUser> {
    if (meta.organization) {
      return await this.model
        .findOne({ id, organization: meta.organization })
        .select('-password -createdAt -__v')
        .exec();
    }
    return await this.model
      .findById(id)
      .select('-password -createdAt -__v')
      .exec();
  }

  async update(id: string, userDTO: UserDTO, meta: IMeta): Promise<IUser> {
    if (!!userDTO.password) {
      const hash = await this.hashPassword(userDTO.password);
      const user = { ...userDTO, password: hash };
      return await this.model.findByIdAndUpdate(id, user);
    }
    if (meta.organization) {
      return await this.model
        .findOneAndUpdate(
          { _id: id, organization: meta.organization },
          userDTO,
          { new: true },
        )
        .exec();
    }
    return await this.model.findByIdAndUpdate(id, userDTO, { new: true });
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
