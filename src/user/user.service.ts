import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<User>,
  ) {}

  create(body: CreateUserDto) {
    const createdUser = new this.userModel(body);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find({});
  }
  findAllUserDetails(userIds) {
    return this.userModel
      .find({ _id: { $in: userIds } }, { firstName: 1, lastName: 1, email: 1 })
      .lean();
  }

  searchUser(search: string) {
    const regex = new RegExp(search, 'i');
    return this.userModel
      .find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      })
      .select('firstName lastName email')
      .exec();
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  findUser(email: string) {
    return this.userModel.findOne({ email: email });
  }
  update(_id: string, param: UpdateUserDto) {
    return this.userModel.findOneAndUpdate({ _id }, { ...param });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
