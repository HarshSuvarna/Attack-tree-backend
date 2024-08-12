import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TreeService } from './tree.service';
import { CreateTreeDto, UpdateTreeDto } from './tree.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { AuthGuard } from '../authentication/auth.guard';
import { NodeService } from '../node/node.service';
import { createPath, findPaths } from '../helpers/leastCost';
import { Node_Type_Enum } from '../common/enums';
import { findLeastSkillPaths } from '../helpers/leastSkill';
import { findHighestFrequencyPaths } from '../helpers/highestFrequency';
import { findPossiblePaths } from '../helpers/allPossiblePaths';
import { v4 as uuidv4 } from 'uuid';
import { findHighestProbabilityPaths } from '../helpers/highestProbability';

@ApiTags('Tree')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@Controller('tree')
export class TreeController {
  constructor(
    private readonly treeService: TreeService,
    private readonly nodeService: NodeService,
  ) {}

  @Post('create')
  async create(@Body() createTreeDto: CreateTreeDto) {
    try {
      const newTree = await this.treeService.create({
        ...createTreeDto,
      });
      return newTree;
    } catch (error) {
      console.log(`API Error: create-tree/post -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Post('create-tree-from-template')
  async createTreeFromTemplate(@Body() body: CreateTreeDto) {
    try {
      const createdTree = { ...body };
      const oldAndNewIds = {};
      const edges = (createdTree?.edges || []).map((e: any) => {
        if (!oldAndNewIds[e.target]) {
          oldAndNewIds[e.target] = uuidv4();
        }
        if (!oldAndNewIds[e.source]) {
          oldAndNewIds[e.source] = uuidv4();
        }
        return {
          ...e,
          source: oldAndNewIds[e?.source],
          target: oldAndNewIds[e.target],
          id: `${oldAndNewIds[e.source]}-${oldAndNewIds[e.target]}`,
        };
      });
      createdTree.edges = [...edges];
      let templateNodes = await this.nodeService.findMany(createdTree?.nodeIds);

      createdTree.nodeIds = [...new Set(Object.values(oldAndNewIds))];
      createdTree.users = [createdTree?.users[0].toString()];

      const newTree = await this.treeService.create({
        ...createdTree,
      });
      let nodesToCreate = templateNodes.map((tn: any, i: number) => {
        tn._id = null;
        const children = (tn?.children || []).map(
          (c: string) => oldAndNewIds[c],
        );
        const parentNodeId = oldAndNewIds[tn?.parentNodeId] || null;
        return {
          ...tn,
          id: oldAndNewIds[tn.id],
          treeId: newTree._id.toString(),
          _id: new Types.ObjectId(),
          children: children,
          parentNodeId: parentNodeId,
        };
      });

      await this.nodeService.insertMany(nodesToCreate);

      return newTree;
    } catch (error) {
      console.log(`API Error: create-tree/post -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Delete('delete-node/:id')
  async deleteNode(@Param('id') id: string) {
    try {
      await this.nodeService.remove(id);
      return { message: 'node delted' };
    } catch (error) {
      console.log(`API Error: delete-node/delete -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('show-path/:id')
  async showPath(@Param('id') id: string, @Query() param: any) {
    try {
      const treeData = await this.getTreeDetails(id);
      const { nodes, edges } = treeData;
      const topNodeId = nodes.find(
        (n) => (n.type = Node_Type_Enum.TOP_GATE),
      )?.id;
      let calculations: any = {};
      switch (param?.field) {
        case 'cost':
          calculations = findPaths({ nodes, edges }, topNodeId);
          break;
        case 'skill':
          calculations = findLeastSkillPaths({ nodes, edges }, topNodeId);
          break;
        case 'frequency':
          calculations = findHighestFrequencyPaths({ nodes, edges }, topNodeId);
          break;
        case 'probability':
          calculations = findHighestProbabilityPaths(
            { nodes, edges },
            topNodeId,
          );
          break;
        case '':
          if (param?.isPossible || false) {
            calculations = findPossiblePaths({ nodes, edges }, topNodeId);
          }
      }
      const animatedEdges = createPath(
        calculations?.leastCostPath ||
          calculations?.leastSkillPath ||
          calculations?.highestFrequencyPath ||
          calculations?.allPossibleEdges ||
          calculations?.highestProbabilityPath,
        [...edges],
        nodes,
      );
      const possibleAnimatedEdges = createPath(
        calculations?.leastPossibleCostPath ||
          calculations?.leastPossibleSkillPath ||
          calculations?.highestPossibleFrequencyPath ||
          calculations?.allPossibleEdges ||
          calculations?.highestPossibleProbabilityPath,
        [...edges],
        nodes,
      );
      return { animatedEdges, possibleAnimatedEdges };
    } catch (error) {
      console.log(`API Error: show-path/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('get-tree/:id')
  findOne(@Param('id') id: string) {
    try {
      return this.treeService.findOne(id);
    } catch (error) {
      console.log(`API Error: create-tree/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('get-all/:userId')
  async findAllTree(@Param('userId') userId: string) {
    try {
      const promises = await Promise.all([
        this.treeService.findAll(userId),
        this.treeService.findTempaltes(),
      ]);
      const userTrees = promises[0];
      const templates = promises[1];
      return { userTrees, templates };
    } catch (error) {
      console.log(`API Error: get-all/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('get-tree-details/:treeId')
  async getTreeDetails(@Param('treeId') treeId: string) {
    try {
      const promises = await Promise.all([
        this.treeService.findOne(treeId),
        this.nodeService.getAllTreeNodes(treeId),
      ]);
      let [treeData, nodes]: [any, any] = promises;
      treeData.nodes = (treeData.nodeIds || []).map((nId: string) =>
        nodes.find((n) => n.id === nId),
      );
      return { ...treeData };
    } catch (error) {
      console.log(`API Error: get-all/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('get-tree-name/:id')
  getTreeName(@Param('id') id: string) {
    try {
      return this.treeService.getName(id);
    } catch (error) {
      console.log(`API Error: get-tree-name/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Patch('update-tree/:id')
  async update(@Param('id') id: string, @Body() body: UpdateTreeDto) {
    try {
      const updateTreeDto = { ...body };
      updateTreeDto.nodeIds = updateTreeDto?.nodes.map((n: any) => n.id);
      updateTreeDto.treeId = new Types.ObjectId(updateTreeDto.treeId);
      const nodesToCreate = updateTreeDto?.nodes;
      delete updateTreeDto?.nodes;
      await Promise.all([
        this.treeService.update(id, updateTreeDto),
        this.nodeService.insertMany(nodesToCreate),
      ]);
      return {
        status: 'success',
        message: 'Tree Updated and nodes created successfully',
      };
    } catch (error) {
      console.log(`API Error: update-tree -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }
}
