import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { FirebaseController } from './firebase.controller';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [CommonModule],
  controllers: [FirebaseController],
  providers: [FirebaseService],
})
export class FirebaseModule {}
