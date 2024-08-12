import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { TreeModule } from './tree/tree.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { NodeModule } from './node/node.module';
import { FirebaseModule } from './firebase/firebase.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_URI_PROD),
    CommonModule,
    UserModule,
    TreeModule,
    AuthenticationModule,
    NodeModule,
    FirebaseModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
