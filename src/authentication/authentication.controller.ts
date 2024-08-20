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
import { LoginDto, VerifyDto } from './authentication.dto';
import { AuthenticationService } from './authentication.service';
import { sendEmail } from 'src/helpers/email';
import { validateToken } from 'src/helpers/validateEmailToken';
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
      if (!user.verified) {
        throw new BadRequestException('User not verified');
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

  @Post('verify-email-url')
  async verifyEmailUrl(@Body() body: VerifyDto) {
    try {
      const { userId, token } = body;
      const validateTokenResponse = await validateToken(token);
      if (!validateTokenResponse.valid) {
        throw new BadRequestException('Token is not valid');
      }
      await this.userService.setUesrvalid(userId);
      return { message: 'User validated', status: 'okay' };
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
        verified: false,
      });

      if (!user) {
        throw new BadRequestException();
      }
      const userData = {
        _id: user._id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email,
        verified: false,
      };

      const emailToken = jwt.sign(
        {
          ...userData,
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      const url = `${process.env.BASE_URL}verify-email/${user._id}/${emailToken}`;
      await sendEmail(user.email, 'Verify Email', url);

      // res.cookie('token', token, this.cookieConfigs);
      return {
        message: 'Please verify your email',
        // userData: userData,
      };
    } catch (error) {
      throw new BadRequestException(error?.message || error);
    }
  }
}
