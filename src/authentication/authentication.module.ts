import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthenticationController } from './authentication.controller';

@Module({
  imports: [CommonModule],
  controllers: [AuthenticationController],
  providers: [],
})
export class AuthenticationModule {}
