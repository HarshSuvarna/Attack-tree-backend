import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { LoginDto } from './authentication.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<User>,
  ) {}

  async validateUser({ email, password }: LoginDto) {
    const response: any = await this.userModel.findOne({ email: email });
    if (!response) return null;
    if (password === response?.password) {
      const { password, ...user } = response;
      return user;
    }
    return null;
  }

  async login(user: LoginDto) {
    console.log("maybe here");
    
    const payload = {
      email: user.email,
    };
    return {
      ...user,
    };
  }
}
