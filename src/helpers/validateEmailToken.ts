import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const validateToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err: any, payload: any) => {
        if (err) {
          reject(
            new UnauthorizedException('Session expired. Please login again.'),
          );
        } else {
          resolve({ valid: true, payload });
        }
      },
    );
  });
};
