import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../authentication/auth.guard';
import { NodeDto } from './node.dto';
import { NodeService } from './node.service';

@ApiTags('Node')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@Controller('node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @Post()
  create(@Body() createNodeDto: NodeDto) {
    return this.nodeService.create(createNodeDto);
  }

  @Get()
  findAll() {
    return this.nodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNodeDto: NodeDto) {
    return this.nodeService.update(+id, updateNodeDto);
  }
}
