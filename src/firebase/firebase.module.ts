import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Module({
  imports: [CommonModule],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
