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

  findAll(userId: string) {
    return this.treeModel.find({
      users: { $in: userId },
    });
  }
  findTempaltes() {
    return this.treeModel.find({
      type: 'template',
    });
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
