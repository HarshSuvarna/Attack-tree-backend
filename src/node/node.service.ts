import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Node } from '../schemas/node.schema';
import { NodeDto } from './node.dto';

@Injectable()
export class NodeService {
  constructor(
    @InjectModel('nodes')
    private readonly nodeModel: Model<Node>,
  ) {}

  create(createNodeDto: NodeDto) {
    return 'This action adds a new node';
  }

  findAll() {
    return `This action returns all node`;
  }

  findOne(id: number) {
    return `This action returns a #${id} node`;
  }

  update(id: number, updateNodeDto: NodeDto) {
    return `This action updates a #${id} node`;
  }

  getAllTreeNodes(treeId: string) {
    return this.nodeModel.find({ treeId });
  }

  insertMany(nodes: any) {
    return this.nodeModel.bulkWrite(
      nodes.map((node: any) => ({
        updateOne: {
          filter: { id: node.id },
          update: { ...node },
          upsert: true,
        },
      })),
    );
  }

  findMany(nodeIds: Array<string>) {
    return this.nodeModel
      .find({
        id: { $in: [...nodeIds] },
      })
      .lean();
  }

  remove(id: string) {
    return this.nodeModel.deleteOne({ id });
  }
}
