import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';
import { Types } from 'mongoose';
import { NodeDto } from 'src/node/node.dto';

export class LogsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  action: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsDate()
  timeStamp: Date;
}
export class CreateTreeDto {
  @ApiProperty({ required: false })
  users: Array<Types.ObjectId> | Array<string>;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  nodes: Array<NodeDto>;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsArray()
  edges: Array<EdgeDto>;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  ownerId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  _id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  treeId: string | Types.ObjectId;

  @ApiProperty()
  @IsArray()
  nodeIds?: Array<string> | Array<any>;

  @ApiProperty()
  @IsArray()
  logs: Array<any>;
}

export class UpdateTreeDto extends PartialType(CreateTreeDto) {}

export class EdgeDto {
  @ApiProperty()
  @IsString()
  sourceHandle: string;

  @ApiProperty()
  @IsString()
  targetHandle: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  source: UUID;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  target: UUID;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  id: UUID;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsBoolean()
  animated: boolean;

  @ApiProperty()
  @IsObject()
  style: any;

  @ApiProperty()
  @IsArray()
  logs: Array<any>;
}
