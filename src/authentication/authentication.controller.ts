import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { CookieOptions, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  private cookieConfigs: CookieOptions;
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {
    this.cookieConfigs = {
      httpOnly: true,
      maxAge: 31556952000, // 1 year in ms
    };
  }

  @Post('login')
  async login(
    @Body() authBody: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { email, password } = authBody;
      const user = await this.userService.findUser(email);
      if (!user) {
        throw new UnauthorizedException();
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (!isMatched) {
        throw new UnauthorizedException();
      }
      const userData = {
        _id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
      };
      const token = jwt.sign(
        {
          ...userData,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' },
      );
      // res.cookie('token', token, this.cookieConfigs);
      return {
        message: 'Login Successful',
        userData: userData,
        token,
      };
    } catch (error) {
      throw new BadRequestException(error?.message || error);
    }
  }

  @Post('register')
  async register(
    @Body() authBody: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const existingUser = await this.userService.findUser(authBody.email);
      if (existingUser) {
        throw new BadRequestException('User already Exists');
      }
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(authBody?.password, salt);
      const user = await this.userService.create({
        ...authBody,
        password: hash,
      });
      if (!user) {
        throw new BadRequestException();
      }
      const userData = {
        _id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
      };
      const token = jwt.sign(
        {
          ...userData,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' },
      );
      // res.cookie('token', token, this.cookieConfigs);
      return {
        message: 'Registration Successful',
        userData: userData,
        token,
      };
    } catch (error) {
      throw new BadRequestException(error?.message || error);
    }
  }
}
