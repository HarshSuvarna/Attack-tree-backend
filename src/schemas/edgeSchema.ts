import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UUID } from 'crypto';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { DataDto } from '../node/node.dto';

export type EdgeDocument = HydratedDocument<Edge>;

@Schema({ timestamps: true, versionKey: false })
export class Edge {
  @Prop()
  sourceHandle: string;

  @Prop()
  targetHandle: string;

  @Prop({ required: true })
  data: DataDto;

  @Prop({ required: true })
  source: UUID;

  @Prop({ required: true })
  target: UUID;

  @Prop({ required: true })
  id: UUID;

  @Prop()
  animated: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  style: any;
}

export const EdgeSchema = SchemaFactory.createForClass(Edge);
