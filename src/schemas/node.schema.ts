import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import { HydratedDocument, Types } from 'mongoose';
import { DataDto, PositionDto } from '../node/node.dto';

export type NodeDocument = HydratedDocument<Node>;

class measuredDto {
  height: number;
  widht: number;
}

@Schema({ timestamps: true, versionKey: false })
export class Node {
  @Prop({ required: false })
  id: UUID;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  position: PositionDto;

  @Prop({ required: true })
  data: DataDto;

  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;

  @Prop()
  parentNodeId: UUID | null;

  @Prop()
  children: Array<UUID | null>;

  @Prop()
  measured: measuredDto;

  @Prop({ required: true })
  treeId: Types.ObjectId;

  @Prop({ required: true })
  documents: Array<any>;
}

export const NodeSchema = SchemaFactory.createForClass(Node);
