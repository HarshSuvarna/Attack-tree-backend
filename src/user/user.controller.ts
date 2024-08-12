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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../authentication/auth.guard';

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      return newUser;
    } catch (error) {
      console.log(`API Error: create-user/post -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('/get-all-users')
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return users;
    } catch (error) {
      console.log(`API Error: get-all-users/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get('/search-user/:search')
  async searchUser(@Param('search') search: string) {
    try {
      return this.userService.searchUser(search);
    } catch (error) {
      console.log(`API Error: search-user/get -`, error?.message || error);
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.userService.findOne(id);
    } catch (error) {
      throw new InternalServerErrorException(error?.message || error);
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
