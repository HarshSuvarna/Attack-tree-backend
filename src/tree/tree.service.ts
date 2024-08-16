import { Injectable } from '@nestjs/common';
import { CreateTreeDto, UpdateTreeDto } from './tree.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tree } from 'src/schemas/tree.schema';

@Injectable()
export class TreeService {
  constructor(
    @InjectModel('trees')
    private readonly treeModel: Model<Tree>,
  ) {}

  create(createTreeDto: CreateTreeDto) {
    const createdTree = new this.treeModel(createTreeDto);
    return createdTree.save();
  }

  // findAll(userId: string) {
  //   return this.treeModel.find({
  //     users: { $in: userId },
  //   });
  // }

  findAll(userId: string) {
    return this.treeModel.aggregate([
      {
        $match: {
          users: userId, // Match trees where the userId is in the users array
        },
      },
      {
        $addFields: {
          convertedId: { $toObjectId: '$ownerId' },
        },
      },
      {
        $lookup: {
          from: 'users', // The users collection
          localField: 'convertedId', // The ownerId field in the trees collection
          foreignField: '_id', // The _id field in the users collection
          as: 'ownerData', // The name of the field to store the result
        },
      },
    ]);
  }

  findTempaltes() {
    return this.treeModel.aggregate([
      {
        $match: {
          type: 'template', // Match trees where the userId is in the users array
        },
      },
      {
        $addFields: {
          convertedId: { $toObjectId: '$ownerId' },
        },
      },
      {
        $lookup: {
          from: 'users', // The users collection
          localField: 'convertedId', // The ownerId field in the trees collection
          foreignField: '_id', // The _id field in the users collection
          as: 'ownerData', // The name of the field to store the result
        },
      },
    ]);
  }
  getName(_id: string) {
    return this.treeModel.findOne({ _id }, { name: 1 });
  }

  findOne(_id: any) {
    return this.treeModel.findOne({ _id }).lean();
  }

  update(id: Object, updateTreeDto: UpdateTreeDto) {
    return this.treeModel.updateOne(
      { _id: id },
      { ...updateTreeDto },
      // { upsert: true },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} tree`;
  }
}
