import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class PositionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  x: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  y: string;
}
export class DataDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsNumber()
  probablity: number;

  @ApiProperty({ required: false })
  @IsNumber()
  cost: number;

  @ApiProperty({ required: false })
  @IsNumber()
  skill: number;

  @ApiProperty({ required: false })
  @IsNumber()
  frequency: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  gate: string;
}
export class NodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  id: UUID;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  position: PositionDto;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  positionAbsolute: PositionDto;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  data: DataDto;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsUUID()
  parentNodeId: UUID | null;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  children: Array<UUID | null>;

  @ApiProperty()
  @IsArray()
  documents: Array<any>;
}
