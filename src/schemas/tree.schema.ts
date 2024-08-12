import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LogsDto } from 'src/tree/tree.dto';

export type TreeDocument = HydratedDocument<Tree>;

@Schema({ timestamps: true, versionKey: false })
export class Tree {
  @Prop({ required: false })
  users: Array<string> | Array<Types.ObjectId>;

  @Prop({ required: true })
  nodeIds: Array<String>;

  @Prop({ required: true })
  edges: Array<Types.ObjectId>;

  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  ownerId: Types.ObjectId;

  @Prop()
  logs: LogsDto;
}

export const TreeSchema = SchemaFactory.createForClass(Tree);
