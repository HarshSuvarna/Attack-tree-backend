import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';

@Module({
  imports: [CommonModule],
  controllers: [NodeController],
  providers: [NodeService],
})
export class NodeModule {}
