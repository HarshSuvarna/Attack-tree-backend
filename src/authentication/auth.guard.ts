import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = request.cookies;
    if (!token) {
      throw new UnauthorizedException('Please provide token');
    }
    const authorizationString = token.replace(/bearer/gim, '').trim();

    const validateTokenResponse = await this.validateToken(authorizationString);
    if (validateTokenResponse.valid) {
      request['payload'] = validateTokenResponse.payload;
      return true;
    }
    return false;
  }

  validateToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, 'soemtingtoreplace', async (err: any, payload: any) => {
        if (err) {
          reject(
            new UnauthorizedException('Session expired. Please login again.'),
          );
        } else {
          resolve({ valid: true, payload });
        }
      });
    });
  }
}
